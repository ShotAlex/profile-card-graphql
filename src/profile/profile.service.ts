import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { ProfileModel } from './profile.model';
import { ProfileRepository } from './profile.repository';

export const DEFAULT_PROFILE_SLUG = 'aleksandr-shot';

@Injectable()
export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}

  async getBySlug(slug: string): Promise<ProfileModel> {
    const profile = await this.repository.findBySlug(slug.trim().toLowerCase());
    if (!profile) {
      throw new GraphQLError(`Profile "${slug}" not found`, { extensions: { code: 'NOT_FOUND' } });
    }
    return profile;
  }

  getAll(): Promise<ProfileModel[]> {
    return this.repository.findAll();
  }
}
