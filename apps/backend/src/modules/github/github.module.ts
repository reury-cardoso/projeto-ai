import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GITHUB_PROFILE_PROVIDER } from './github.tokens';
import { GithubService } from './github.service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: GITHUB_PROFILE_PROVIDER,
      useClass: GithubService,
    },
  ],
  exports: [GITHUB_PROFILE_PROVIDER],
})
export class GithubModule {}
