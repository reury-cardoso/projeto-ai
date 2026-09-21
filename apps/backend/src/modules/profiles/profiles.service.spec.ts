import { Test } from '@nestjs/testing';
import { GITHUB_PROFILE_PROVIDER } from '../github/github.tokens';
import type { GithubProfileProvider } from '../github/interfaces/github-profile-provider.interface';
import { LINKEDIN_PROFILE_PROVIDER } from '../linkedin/linkedin.tokens';
import type { LinkedinProfileProvider } from '../linkedin/interfaces/linkedin-profile-provider.interface';
import { ProfilesService } from './profiles.service';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let githubProfileProvider: jest.Mocked<GithubProfileProvider>;
  let linkedinProfileProvider: jest.Mocked<LinkedinProfileProvider>;

  beforeEach(async () => {
    githubProfileProvider = {
      getProfileByUsername: jest.fn(),
    };
    linkedinProfileProvider = {
      getProfileByStudentId: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: GITHUB_PROFILE_PROVIDER, useValue: githubProfileProvider },
        {
          provide: LINKEDIN_PROFILE_PROVIDER,
          useValue: linkedinProfileProvider,
        },
      ],
    }).compile();

    service = moduleRef.get(ProfilesService);
  });

  it('combina os dados do GitHub e do LinkedIn para o mesmo identificador', async () => {
    githubProfileProvider.getProfileByUsername.mockResolvedValue({
      username: 'jane-doe',
      name: 'Jane Doe',
      avatarUrl: 'https://example.com/avatar.png',
      bio: null,
      publicRepos: 5,
      followers: 10,
      profileUrl: 'https://github.com/jane-doe',
    });
    linkedinProfileProvider.getProfileByStudentId.mockResolvedValue(null);

    const result = await service.getStudentProfile('jane-doe');

    expect(result.identifier).toBe('jane-doe');
    expect(result.github?.username).toBe('jane-doe');
    expect(result.linkedin).toBeNull();
  });

  it('retorna github nulo quando a busca falha, sem lançar erro', async () => {
    githubProfileProvider.getProfileByUsername.mockRejectedValue(
      new Error('not found'),
    );
    linkedinProfileProvider.getProfileByStudentId.mockResolvedValue(null);

    const result = await service.getStudentProfile('unknown');

    expect(result.github).toBeNull();
  });
});
