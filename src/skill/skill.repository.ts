import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { groupByKey } from '../common/group-by-key';
import { SkillModel } from './skill.model';

@Injectable()
export class SkillRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** One query for any number of profiles; result is aligned with `profileIds`. */
  async findByProfileIds(profileIds: readonly number[]): Promise<SkillModel[][]> {
    const rows = await this.prisma.profileSkill.findMany({
      where: { profileId: { in: [...profileIds] } },
      include: { skill: true },
      orderBy: { position: 'asc' },
    });
    return groupByKey(profileIds, rows, (row) => row.profileId).map((group) => group.map((row) => row.skill));
  }

  /** Stack of each job, one query for all jobs in the response. */
  async findByExperienceIds(experienceIds: readonly number[]): Promise<SkillModel[][]> {
    const rows = await this.prisma.experienceSkill.findMany({
      where: { experienceId: { in: [...experienceIds] } },
      include: { skill: true },
      orderBy: { position: 'asc' },
    });
    return groupByKey(experienceIds, rows, (row) => row.experienceId).map((group) => group.map((row) => row.skill));
  }
}
