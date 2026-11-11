import { PrismaClient } from '@prisma/client';
import { OWNER_PROFILE, ProfileSeed, SKILL_CATALOG } from './profile.data';

const month = (value: string): Date => new Date(`${value}-01T00:00:00.000Z`);

/** Idempotent: safe to run on every container start. */
export async function seedProfile(prisma: PrismaClient, data: ProfileSeed = OWNER_PROFILE): Promise<void> {
  const usedSkills = new Set([...data.skills, ...data.experience.flatMap((job) => job.stack)]);
  for (const name of usedSkills) {
    if (!SKILL_CATALOG[name]) throw new Error(`Skill "${name}" is missing in SKILL_CATALOG`);
  }

  await prisma.$transaction(async (tx) => {
    const skillIds = new Map<string, number>();
    for (const name of usedSkills) {
      const skill = await tx.skill.upsert({
        where: { name },
        update: { category: SKILL_CATALOG[name] },
        create: { name, category: SKILL_CATALOG[name] },
      });
      skillIds.set(name, skill.id);
    }

    const { slug, name, headline, description, location } = data;
    const profile = await tx.profile.upsert({
      where: { slug },
      update: { name, headline, description, location },
      create: { slug, name, headline, description, location },
    });

    // Children are replaced as a whole: simpler than diffing and keeps the seed the single source of truth.
    await tx.profileLink.deleteMany({ where: { profileId: profile.id } });
    await tx.profileSkill.deleteMany({ where: { profileId: profile.id } });
    await tx.experience.deleteMany({ where: { profileId: profile.id } });
    await tx.project.deleteMany({ where: { profileId: profile.id } });

    await tx.profileLink.createMany({
      data: data.links.map((link, position) => ({ ...link, profileId: profile.id, position })),
    });
    await tx.profileSkill.createMany({
      data: data.skills.map((skill, position) => ({ profileId: profile.id, skillId: skillIds.get(skill)!, position })),
    });
    for (const job of data.experience) {
      await tx.experience.create({
        data: {
          profileId: profile.id,
          company: job.company,
          position: job.position,
          context: job.context,
          startDate: month(job.start),
          endDate: job.end ? month(job.end) : null,
          achievements: { create: job.achievements.map((text, position) => ({ text, position })) },
          stack: { create: job.stack.map((skill, position) => ({ skillId: skillIds.get(skill)!, position })) },
        },
      });
    }
    await tx.project.createMany({
      data: data.projects.map((project, position) => ({
        profileId: profile.id,
        name: project.name,
        description: project.description,
        url: project.url ?? null,
        repoUrl: project.repoUrl ?? null,
        position,
      })),
    });
  });
}

if (require.main === module) {
  const prisma = new PrismaClient();
  seedProfile(prisma)
    .then(() => console.log(`Seeded profile "${OWNER_PROFILE.slug}"`))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
