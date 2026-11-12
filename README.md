# profile-card-graphql

Digital business card of **Aleksandr Shot** — a GraphQL API that tells about me, my skills, work history and projects.

Stack: **TypeScript · Node.js · NestJS · Prisma · PostgreSQL · GraphQL (Apollo Server) · Docker · Git**.

- **Live Apollo Sandbox: https://profile-card-graphql-production.up.railway.app/graphql**
- Locally: `http://localhost:3000/graphql`
- Health check: `GET /health`

## Run

```bash
docker compose up --build
```

Then open http://localhost:3000/graphql. On every start the container applies migrations and seeds the
database with my data, so there is nothing to prepare by hand. The seed is idempotent: restarting the
container does not duplicate anything.

Without Docker (needs a running PostgreSQL):

```bash
cp .env.example .env
npm ci
npx prisma migrate deploy
npm run build && npm run db:seed
npm start
```

## Example query

```graphql
query {
  profile {
    name
    headline
    description
    location
    links { kind label url }
    skills { name category }
    experience {
      company
      position
      context
      startDate
      endDate
      isCurrent
      durationMonths
      achievements
      stack { name }
    }
    projects { name description url repoUrl }
  }
}
```

`profile` takes an optional `slug` (default `aleksandr-shot`); `profiles` lists all cards.

## Architecture decisions

### Layers

```
src/
  profile/      Profile + links: model, repository, service, resolver
  experience/   work history: repository, service (dates and durations), resolver for nested fields
  skill/        shared skill dictionary: model, repository
  project/      projects: model, repository
  loaders/      per-request DataLoaders and the @Loaders() decorator
  database/     PrismaService, seed script and the seed data
```

Each domain module is split the same way:

- **Resolver** only maps GraphQL fields to calls. No queries, no business rules.
- **Service** holds business logic: which job is "current", how to sort the history, how to count
  months. It is plain TypeScript without database access, so it is unit-tested without mocks.
- **Repository** is the only place that talks to Prisma. Every method that loads children takes a
  *list* of parent ids and returns results aligned with that list — the shape DataLoader expects.

### Database

- `Profile` is the aggregate root; everything else hangs off it with `onDelete: Cascade`. The API can
  hold several cards (for example, one per language) without schema changes.
- `Skill` is a **shared dictionary** with a unique name. The profile's skill list (`ProfileSkill`) and
  each job's stack (`ExperienceSkill`) are many-to-many links to it, so "React" exists once and the data
  cannot drift between "React" and "React.js".
- Lists that have a meaningful order (links, skills, achievements, stack, projects) store an explicit
  `position` instead of relying on insertion order.
- Work periods are stored as `DATE`; `endDate = NULL` means the current job. The API returns months as
  `YYYY-MM` and a computed `durationMonths`, so clients do not repeat date math.
- Indexes are on the foreign key + sort column used by every query (`profileId, position` and so on).

### Nested data without N+1

The naive way to resolve `experience { achievements stack }` is one SQL query per job for each nested
field. Here every nested list goes through a **DataLoader** created per request
(`loaders/loaders.factory.ts`): resolvers call `loader.load(parentId)`, DataLoader collects the ids within
one tick and the repository loads them with a single `WHERE fk IN (...)`.

The full example query above runs **9 SQL queries no matter how many jobs, skills or achievements there
are** (profile, links, skills ×2, experience, achievements, stack ×2, projects; Prisma loads an
`include` with a separate query). You can see it yourself:

```bash
LOG_SQL=true npm start
```

Loaders are created per request on purpose: their cache must not be shared between users.

### Seed

`src/database/seed/profile.data.ts` is the single source of truth for the card. The seed upserts skills
and the profile by unique keys and replaces the profile's child rows inside one transaction. This is
simpler than diffing and keeps the database identical to the file after every start. Unknown skill
names fail the seed early instead of creating a half-filled card.

### Why these versions

NestJS 11, `@nestjs/graphql` 13, Apollo Server 5, Prisma 6. Prisma 7 changes client generation and
requires driver adapters; for a small API I preferred the version whose behaviour I know well and that
works with NestJS's CommonJS build out of the box.

### Production settings

- Apollo Sandbox and introspection stay enabled in production: the data is a public read-only card and
  the task asks for Sandbox on the deployed link.
- Stack traces are not returned in errors when `NODE_ENV=production`.
- The Docker image is a two-stage build (dev dependencies stay in the build stage), runs as the
  non-root `node` user and has a health check on `/health`.

## Tests

```bash
npm test          # unit: date logic, sorting, DataLoader grouping
npm run test:e2e  # e2e: real PostgreSQL from DATABASE_URL, seed run twice, GraphQL over HTTP
```

GitHub Actions runs type checking, unit tests, migrations, e2e tests against PostgreSQL and the Docker
build on every push.

## Deploy

Deployed on Railway: PostgreSQL + a service built from the Dockerfile, `DATABASE_URL` points to the
database. `render.yaml` describes the same setup for Render. Any platform that runs a Dockerfile works the
same way: set `DATABASE_URL`, and the container migrates and seeds the database on start.
