import { Inject, Injectable, Logger } from '@nestjs/common';
import { GITHUB_PROFILE_PROVIDER } from '../github/github.tokens';
import type { GithubProfileProvider } from '../github/interfaces/github-profile-provider.interface';
import { LINKEDIN_PROFILE_PROVIDER } from '../linkedin/linkedin.tokens';
import type { LinkedinProfileProvider } from '../linkedin/interfaces/linkedin-profile-provider.interface';
import { StudentProfileDto } from './dto/student-profile.dto';

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(
    @Inject(GITHUB_PROFILE_PROVIDER)
    private readonly githubProfileProvider: GithubProfileProvider,
    @Inject(LINKEDIN_PROFILE_PROVIDER)
    private readonly linkedinProfileProvider: LinkedinProfileProvider,
  ) {}

  async getStudentProfile(identifier: string): Promise<StudentProfileDto> {
    const [github, linkedin] = await Promise.all([
      this.githubProfileProvider
        .getProfileByUsername(identifier)
        .catch((error) => {
          this.logger.warn(
            `Não foi possível obter o perfil do GitHub para "${identifier}": ${error.message}`,
          );
          return null;
        }),
      this.linkedinProfileProvider.getProfileByStudentId(identifier),
    ]);

    return { identifier, github, linkedin };
  }
}
