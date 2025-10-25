import axios, { AxiosInstance } from 'axios';
import { BaseProvider, BaseProviderConfig } from './base.provider';

export interface GitHubProviderConfig extends BaseProviderConfig {
  username: string;
  token?: string; // GitHub token opcional para rate limits maiores
}

export interface GitHubStats {
  publicRepos: number;
  totalStars: number;
  followers: number;
  following: number;
  contributions: number;
  topLanguage: string;
  languages: Record<string, number>;
  recentActivity: string[];
}

export class GitHubProvider extends BaseProvider {
  private github: AxiosInstance;
  private providerConfig: GitHubProviderConfig;

  constructor(config: GitHubProviderConfig) {
    super(config);
    this.providerConfig = config;
    this.github = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'User-Agent': 'GitHub-Dyno-Badges/1.0',
        ...(config.token && { Authorization: `token ${config.token}` }),
      },
    });
  }

  get providerName(): string {
    return 'github';
  }

  get description(): string {
    return 'Estatísticas do perfil GitHub (repositórios, estrelas, seguidores, linguagens)';
  }

  async validateConfig(): Promise<boolean> {
    try {
      const response = await this.github.get(`/users/${this.providerConfig.username}`);
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao validar configuração do GitHub:', error);
      return false;
    }
  }

  async fetchData(): Promise<Record<string, unknown>> {
    try {
      // Buscar dados do usuário
      const userResponse = await this.github.get(`/users/${this.providerConfig.username}`);
      const user = userResponse.data;

      // Buscar repositórios públicos
      const reposResponse = await this.github.get(
        `/users/${this.providerConfig.username}/repos?per_page=100&sort=updated`
      );
      const repos = reposResponse.data;

      // Calcular estatísticas
      const totalStars = repos.reduce(
        (sum: number, repo: any) => sum + repo.stargazers_count,
        0
      );

      // Analisar linguagens
      const languageStats: Record<string, number> = {};
      for (const repo of repos) {
        if (repo.language) {
          languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
      }

      const topLanguage = Object.keys(languageStats).reduce(
        (a, b) => (languageStats[a] > languageStats[b] ? a : b),
        'N/A'
      );

      // Buscar contribuições (aproximação baseada nos repositórios)
      const contributions = repos.reduce(
        (sum: number, repo: any) => sum + (repo.size || 0),
        0
      );

      // Atividade recente (últimos 5 repositórios atualizados)
      const recentActivity = repos
        .slice(0, 5)
        .map((repo: any) => repo.name);

      return {
        publicRepos: user.public_repos,
        totalStars,
        followers: user.followers,
        following: user.following,
        contributions,
        topLanguage,
        languages: languageStats,
        recentActivity,
      };
    } catch (error) {
      console.error('Erro ao buscar dados do GitHub:', error);
      throw new Error('Falha ao buscar dados do GitHub');
    }
  }

  generateContent(data: Record<string, unknown>): string {
    const stats = data as unknown as GitHubStats;
    const {
      publicRepos,
      totalStars,
      followers,
      following,
      topLanguage,
      languages,
      recentActivity,
    } = stats;

    const languageList = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([lang, count]) => `${lang} (${count})`)
      .join(', ');

    return `
## 📊 GitHub Stats

- **Repositórios Públicos:** ${publicRepos}
- **Total de Estrelas:** ${totalStars} ⭐
- **Seguidores:** ${followers} | **Seguindo:** ${following}
- **Linguagem Principal:** ${topLanguage}
- **Linguagens:** ${languageList}

### 🚀 Atividade Recente
${recentActivity.map(repo => `- [${repo}](https://github.com/${this.providerConfig.username}/${repo})`).join('\n')}
    `.trim();
  }
}
