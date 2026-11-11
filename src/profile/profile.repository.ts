import { Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { groupByKey } from '../common/group-by-key';
import { ProfileLinkModel } from './profile.model';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findBySlug(slug: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { slug } });
  }

  findAll(): Promise<Profile[]> {
    return this.prisma.profile.findMany({ orderBy: { id: 'asc' } });
  }

  async findLinksByProfileIds(profileIds: readonly number[]): Promise<ProfileLinkModel[][]> {
    const rows = await this.prisma.profileLink.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { position: 'asc' },
    });
    return groupByKey(profileIds, rows, (row) => row.profileId);
  }
}
