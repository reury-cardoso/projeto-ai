import { GithubProfileDto } from '../dto/github-profile.dto';

export interface GithubProfileProvider {
  getProfileByUsername(username: string): Promise<GithubProfileDto>;
}
