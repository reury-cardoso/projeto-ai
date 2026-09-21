import { GithubProfileDto } from '../../github/dto/github-profile.dto';
import { LinkedinProfileDto } from '../../linkedin/dto/linkedin-profile.dto';

export class StudentProfileDto {
  identifier!: string;
  github!: GithubProfileDto | null;
  linkedin!: LinkedinProfileDto | null;
}
