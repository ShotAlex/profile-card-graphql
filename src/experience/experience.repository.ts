import { Injectable } from '@nestjs/common';
import { Experience } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { groupByKey } from '../common/group-by-key';

@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProfileIds(profileIds: readonly number[]): Promise<Experience[][]> {
    const rows = await this.prisma.experience.findMany({ where: { profileId: { in: [...profileIds] } } });
    return groupByKey(profileIds, rows, (row) => row.profileId);
  }

  async findAchievementsByExperienceIds(experienceIds: readonly number[]): Promise<string[][]> {
    const rows = await this.prisma.achievement.findMany({
      where: { experienceId: { in: [...experienceIds] } },
      orderBy: { position: 'asc' },
    });
    return groupByKey(experienceIds, rows, (row) => row.experienceId).map((group) => group.map((row) => row.text));
  }
}
