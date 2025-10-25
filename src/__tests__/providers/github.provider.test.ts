import { GitHubProvider, GitHubProviderConfig } from '../../providers/github.provider';

// Mock do axios
jest.mock('axios');
const mockedAxios = require('axios');

describe('GitHubProvider', () => {
  let provider: GitHubProvider;
  let mockConfig: GitHubProviderConfig;

  beforeEach(() => {
    mockConfig = {
      enabled: true,
      name: 'github',
      username: 'testuser',
      token: 'test-token',
    };
    provider = new GitHubProvider(mockConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('deve criar instância com configuração válida', () => {
      expect(provider).toBeInstanceOf(GitHubProvider);
      expect(provider.providerName).toBe('github');
      expect(provider.description).toContain('GitHub');
    });
  });

  describe('validateConfig', () => {
    it('deve retornar true para configuração válida', async () => {
      const mockGet = jest.fn().mockResolvedValue({ status: 200 });
      mockedAxios.create = jest.fn().mockReturnValue({ get: mockGet });

      // Recriar provider após mock
      provider = new GitHubProvider(mockConfig);

      const result = await provider.validateConfig();
      expect(result).toBe(true);
    });

    it('deve retornar false para configuração inválida', async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error('User not found'));
      mockedAxios.create = jest.fn().mockReturnValue({ get: mockGet });

      // Recriar provider após mock
      provider = new GitHubProvider(mockConfig);

      const result = await provider.validateConfig();
      expect(result).toBe(false);
    });
  });

  describe('fetchData', () => {
    it('deve buscar dados do GitHub corretamente', async () => {
      const mockUserData = {
        public_repos: 10,
        followers: 50,
        following: 30,
      };

      const mockReposData = [
        { name: 'repo1', stargazers_count: 5, language: 'JavaScript', size: 1000 },
        { name: 'repo2', stargazers_count: 3, language: 'TypeScript', size: 2000 },
        { name: 'repo3', stargazers_count: 0, language: null, size: 500 },
      ];

      const mockAxiosInstance = {
        get: jest.fn()
          .mockResolvedValueOnce({ data: mockUserData })
          .mockResolvedValueOnce({ data: mockReposData }),
      };

      mockedAxios.create = jest.fn().mockReturnValue(mockAxiosInstance);

      // Recriar provider após mock
      provider = new GitHubProvider(mockConfig);

      const result = await provider.fetchData();

      expect(result).toEqual({
        publicRepos: 10,
        totalStars: 8,
        followers: 50,
        following: 30,
        contributions: 3500,
        topLanguage: 'TypeScript',
        languages: { JavaScript: 1, TypeScript: 1 },
        recentActivity: expect.any(Array),
      });
    });

    it('deve lançar erro quando falha ao buscar dados', async () => {
      const mockAxiosInstance = {
        get: jest.fn().mockRejectedValue(new Error('API Error')),
      };

      mockedAxios.create = jest.fn().mockReturnValue(mockAxiosInstance);

      // Recriar provider após mock
      provider = new GitHubProvider(mockConfig);

      await expect(provider.fetchData()).rejects.toThrow('Falha ao buscar dados do GitHub');
    });
  });

  describe('generateContent', () => {
    it('deve gerar conteúdo formatado corretamente', () => {
      const mockData = {
        publicRepos: 15,
        totalStars: 100,
        followers: 75,
        following: 25,
        contributions: 5000,
        topLanguage: 'TypeScript',
        languages: { TypeScript: 5, JavaScript: 3, Python: 2 },
        recentActivity: ['repo1', 'repo2', 'repo3'],
      };

      const content = provider.generateContent(mockData);

      expect(content).toContain('📊 GitHub Stats');
      expect(content).toContain('**Repositórios Públicos:** 15');
      expect(content).toContain('**Total de Estrelas:** 100');
      expect(content).toContain('**Seguidores:** 75');
      expect(content).toContain('**Linguagem Principal:** TypeScript');
      expect(content).toContain('🚀 Atividade Recente');
    });
  });
});
