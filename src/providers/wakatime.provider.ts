import axios, { AxiosInstance } from 'axios';
import { BaseProvider, BaseProviderConfig } from './base.provider';

export interface WakaTimeProviderConfig extends BaseProviderConfig {
  apiKey: string;
  username?: string;
}

export interface WakaTimeStats {
  totalTime: string;
  dailyAverage: string;
  topLanguage: string;
  topProject: string;
  languages: Array<{ name: string; percent: number; time: string }>;
  projects: Array<{ name: string; percent: number; time: string }>;
}

export class WakaTimeProvider extends BaseProvider {
  private wakatime: AxiosInstance;
  private providerConfig: WakaTimeProviderConfig;

  constructor(config: WakaTimeProviderConfig) {
    super(config);
    this.providerConfig = config;
    this.wakatime = axios.create({
      baseURL: 'https://wakatime.com/api/v1',
      headers: {
        Authorization: `Basic ${Buffer.from(config.apiKey).toString('base64')}`,
      },
    });
  }

  get providerName(): string {
    return 'wakatime';
  }

  get description(): string {
    return 'Estatísticas de tempo de codificação do WakaTime';
  }

  async validateConfig(): Promise<boolean> {
    try {
      const response = await this.wakatime.get('/users/current');
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao validar configuração do WakaTime:', error);
      return false;
    }
  }

  async fetchData(): Promise<Record<string, unknown>> {
    try {
      const username = this.providerConfig.username || 'current';

      // Buscar estatísticas gerais
      const statsResponse = await this.wakatime.get(`/users/${username}/stats/last_7_days`);
      const stats = statsResponse.data.data;

      // Buscar linguagens
      const languages = stats.languages?.slice(0, 5).map((lang: any) => ({
        name: lang.name,
        percent: lang.percent,
        time: lang.text,
      })) || [];

      // Buscar projetos
      const projects = stats.projects?.slice(0, 5).map((proj: any) => ({
        name: proj.name,
        percent: proj.percent,
        time: proj.text,
      })) || [];

      return {
        totalTime: stats.total_seconds ? this.formatTime(stats.total_seconds) : '0h',
        dailyAverage: stats.daily_average ? this.formatTime(stats.daily_average) : '0h',
        topLanguage: languages[0]?.name || 'N/A',
        topProject: projects[0]?.name || 'N/A',
        languages,
        projects,
      };
    } catch (error) {
      console.error('Erro ao buscar dados do WakaTime:', error);
      throw new Error('Falha ao buscar dados do WakaTime');
    }
  }

  generateContent(data: Record<string, unknown>): string {
    const stats = data as unknown as WakaTimeStats;
    const {
      totalTime,
      dailyAverage,
      topLanguage,
      topProject,
      languages,
      projects,
    } = stats;

    const languageList = languages
      .map(lang => `${lang.name} (${lang.percent}%)`)
      .join(', ');

    const projectList = projects
      .map(proj => `${proj.name} (${proj.percent}%)`)
      .join(', ');

    return `
## ⏱️ WakaTime Stats

- **Tempo Total (7 dias):** ${totalTime}
- **Média Diária:** ${dailyAverage}
- **Linguagem Principal:** ${topLanguage}
- **Projeto Principal:** ${topProject}

### 🔥 Linguagens Mais Usadas
${languageList}

### 📁 Projetos Mais Ativos
${projectList}
    `.trim();
  }

  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}
