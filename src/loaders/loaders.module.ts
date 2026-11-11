import { Module } from '@nestjs/common';
import { ExperienceModule } from '../experience/experience.module';
import { ProfileModule } from '../profile/profile.module';
import { ProjectModule } from '../project/project.module';
import { SkillModule } from '../skill/skill.module';
import { LoadersFactory } from './loaders.factory';

@Module({
  imports: [ProfileModule, SkillModule, ExperienceModule, ProjectModule],
  providers: [LoadersFactory],
  exports: [LoadersFactory],
})
export class LoadersModule {}
