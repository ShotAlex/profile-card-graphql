import { Injectable } from '@nestjs/common';
import { Experience } from '@prisma/client';
import DataLoader from 'dataloader';
import { ExperienceRepository } from '../experience/experience.repository';
import { ProfileLinkModel } from '../profile/profile.model';
import { ProfileRepository } from '../profile/profile.repository';
import { ProjectModel } from '../project/project.model';
import { ProjectRepository } from '../project/project.repository';
import { SkillModel } from '../skill/skill.model';
import { SkillRepository } from '../skill/skill.repository';

export interface RequestLoaders {
  linksByProfile: DataLoader<number, ProfileLinkModel[]>;
  skillsByProfile: DataLoader<number, SkillModel[]>;
  experienceByProfile: DataLoader<number, Experience[]>;
  projectsByProfile: DataLoader<number, ProjectModel[]>;
  achievementsByExperience: DataLoader<number, string[]>;
  stackByExperience: DataLoader<number, SkillModel[]>;
}

/**
 * Builds a fresh set of DataLoaders for every GraphQL request.
 * Per-request instances keep the cache from leaking between users,
 * while inside one request every nested list is fetched with a single
 * `WHERE ... IN (...)` query instead of one query per parent (N+1).
 */
@Injectable()
export class LoadersFactory {
  constructor(
    private readonly profiles: ProfileRepository,
    private readonly skills: SkillRepository,
    private readonly experience: ExperienceRepository,
    private readonly projects: ProjectRepository,
  ) {}

  create(): RequestLoaders {
    return {
      linksByProfile: new DataLoader((ids) => this.profiles.findLinksByProfileIds(ids)),
      skillsByProfile: new DataLoader((ids) => this.skills.findByProfileIds(ids)),
      experienceByProfile: new DataLoader((ids) => this.experience.findByProfileIds(ids)),
      projectsByProfile: new DataLoader((ids) => this.projects.findByProfileIds(ids)),
      achievementsByExperience: new DataLoader((ids) => this.experience.findAchievementsByExperienceIds(ids)),
      stackByExperience: new DataLoader((ids) => this.skills.findByExperienceIds(ids)),
    };
  }
}
