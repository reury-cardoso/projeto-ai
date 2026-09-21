import { Module } from '@nestjs/common';
import { GithubModule } from '../github/github.module';
import { LinkedinModule } from '../linkedin/linkedin.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [GithubModule, LinkedinModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
