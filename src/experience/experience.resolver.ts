import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Loaders, RequestLoaders } from '../loaders/loaders.decorator';
import { SkillModel } from '../skill/skill.model';
import { ExperienceModel } from './experience.model';

@Resolver(() => ExperienceModel)
export class ExperienceResolver {
  @ResolveField(() => [String], { description: 'What was done and what it gave the business' })
  achievements(@Parent() experience: ExperienceModel, @Loaders() loaders: RequestLoaders): Promise<string[]> {
    return loaders.achievementsByExperience.load(experience.id);
  }

  @ResolveField(() => [SkillModel])
  stack(@Parent() experience: ExperienceModel, @Loaders() loaders: RequestLoaders): Promise<SkillModel[]> {
    return loaders.stackByExperience.load(experience.id);
  }
}
