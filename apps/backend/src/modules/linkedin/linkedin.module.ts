import { Module } from '@nestjs/common';
import { LINKEDIN_PROFILE_PROVIDER } from './linkedin.tokens';
import { LinkedinService } from './linkedin.service';

@Module({
  providers: [
    {
      provide: LINKEDIN_PROFILE_PROVIDER,
      useClass: LinkedinService,
    },
  ],
  exports: [LINKEDIN_PROFILE_PROVIDER],
})
export class LinkedinModule {}
