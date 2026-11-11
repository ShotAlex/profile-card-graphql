import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ExperienceModel } from '../experience/experience.model';
import { ExperienceService } from '../experience/experience.service';
import { Loaders, RequestLoaders } from '../loaders/loaders.decorator';
import { ProjectModel } from '../project/project.model';
import { SkillModel } from '../skill/skill.model';
import { ProfileLinkModel, ProfileModel } from './profile.model';
import { DEFAULT_PROFILE_SLUG, ProfileService } from './profile.service';

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly experienceService: ExperienceService,
  ) {}

  @Query(() => ProfileModel, { description: 'Business card by slug. Without arguments returns the owner of this API.' })
  profile(@Args('slug', { defaultValue: DEFAULT_PROFILE_SLUG }) slug: string): Promise<ProfileModel> {
    return this.profileService.getBySlug(slug);
  }

  @Query(() => [ProfileModel])
  profiles(): Promise<ProfileModel[]> {
    return this.profileService.getAll();
  }

  @ResolveField(() => [ProfileLinkModel], { description: 'GitHub, LinkedIn and other professional resources' })
  links(@Parent() profile: ProfileModel, @Loaders() loaders: RequestLoaders): Promise<ProfileLinkModel[]> {
    return loaders.linksByProfile.load(profile.id);
  }

  @ResolveField(() => [SkillModel])
  skills(@Parent() profile: ProfileModel, @Loaders() loaders: RequestLoaders): Promise<SkillModel[]> {
    return loaders.skillsByProfile.load(profile.id);
  }

  @ResolveField(() => [ExperienceModel], { description: 'Work history, most recent first' })
  async experience(@Parent() profile: ProfileModel, @Loaders() loaders: RequestLoaders): Promise<ExperienceModel[]> {
    const rows = await loaders.experienceByProfile.load(profile.id);
    const now = new Date();
    return this.experienceService.sort(rows).map((row) => this.experienceService.toModel(row, now));
  }

  @ResolveField(() => [ProjectModel])
  projects(@Parent() profile: ProfileModel, @Loaders() loaders: RequestLoaders): Promise<ProjectModel[]> {
    return loaders.projectsByProfile.load(profile.id);
  }
}
