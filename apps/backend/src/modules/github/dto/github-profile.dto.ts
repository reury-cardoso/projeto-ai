export class GithubProfileDto {
  username!: string;
  name!: string | null;
  avatarUrl!: string;
  bio!: string | null;
  publicRepos!: number;
  followers!: number;
  profileUrl!: string;
}
