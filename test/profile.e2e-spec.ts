import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { seedProfile } from '../src/database/seed/seed';

/** Runs against a real PostgreSQL from DATABASE_URL with migrations applied. */
describe('GraphQL API (e2e)', () => {
  let app: INestApplication;

  const gql = (query: string) =>
    request(app.getHttpServer()).post('/graphql').set('apollo-require-preflight', 'true').send({ query });

  beforeAll(async () => {
    const prisma = new PrismaClient();
    await seedProfile(prisma);
    await seedProfile(prisma); // second run must not duplicate anything
    await prisma.$disconnect();

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the profile with nested skills, experience and projects', async () => {
    const { body } = await gql(`{
      profile {
        name
        links { kind url }
        skills { name category }
        experience { company isCurrent durationMonths achievements stack { name } }
        projects { name }
      }
    }`).expect(200);

    const profile = body.data.profile;
    expect(profile.name).toBe('Aleksandr Shot');
    expect(profile.links).toContainEqual({ kind: 'GITHUB', url: 'https://github.com/ShotAlex' });
    expect(profile.experience[0]).toMatchObject({ company: 'ucrm.by', isCurrent: true });
    expect(profile.experience).toHaveLength(5);
    expect(profile.experience[1].stack.map((skill: { name: string }) => skill.name)).toContain('MobX');
    expect(profile.experience[1].achievements.length).toBeGreaterThan(0);
    expect(new Set(profile.skills.map((skill: { name: string }) => skill.name)).size).toBe(profile.skills.length);
  });

  it('responds with NOT_FOUND for an unknown slug', async () => {
    const { body } = await gql('{ profile(slug: "nobody") { name } }').expect(200);
    expect(body.errors[0].extensions.code).toBe('NOT_FOUND');
  });

  it('lists all profiles', async () => {
    const { body } = await gql('{ profiles { slug } }').expect(200);
    expect(body.data.profiles).toEqual([{ slug: 'aleksandr-shot' }]);
  });
});
