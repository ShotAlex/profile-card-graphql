import { Module } from '@nestjs/common';
import { ExperienceModule } from '../experience/experience.module';
import { ProfileRepository } from './profile.repository';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
  imports: [ExperienceModule],
  providers: [ProfileRepository, ProfileService, ProfileResolver],
  exports: [ProfileRepository],
})
export class ProfileModule {}
