import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { groupByKey } from '../common/group-by-key';
import { ProjectModel } from './project.model';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProfileIds(profileIds: readonly number[]): Promise<ProjectModel[][]> {
    const rows = await this.prisma.project.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { position: 'asc' },
    });
    return groupByKey(profileIds, rows, (row) => row.profileId);
  }
}
