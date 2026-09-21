import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { GithubProfileDto } from './dto/github-profile.dto';
import type { GithubProfileProvider } from './interfaces/github-profile-provider.interface';

interface GithubUserResponse {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  html_url: string;
}

@Injectable()
export class GithubService implements GithubProfileProvider {
  private readonly logger = new Logger(GithubService.name);
  private readonly baseUrl = 'https://api.github.com';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getProfileByUsername(username: string): Promise<GithubProfileDto> {
    const token = this.configService.get<string>('GITHUB_TOKEN');

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<GithubUserResponse>(
          `${this.baseUrl}/users/${username}`,
          {
            headers: {
              Accept: 'application/vnd.github+json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        ),
      );

      return {
        username: data.login,
        name: data.name,
        avatarUrl: data.avatar_url,
        bio: data.bio,
        publicRepos: data.public_repos,
        followers: data.followers,
        profileUrl: data.html_url,
      };
    } catch (error) {
      this.logger.error(
        `Falha ao buscar perfil do GitHub para "${username}"`,
        (error as AxiosError).message,
      );
      throw error;
    }
  }
}
