import axios, { AxiosInstance } from 'axios';
import { BaseProvider, BaseProviderConfig } from './base.provider';

export interface StackOverflowProviderConfig extends BaseProviderConfig {
  userId: string;
  site?: string;
}

export interface StackOverflowStats {
  reputation: number;
  badgeCounts: {
    gold: number;
    silver: number;
    bronze: number;
  };
  totalBadges: number;
  topTags: Array<{ name: string; count: number }>;
  recentActivity: Array<{ title: string; score: number; link: string }>;
}

export class StackOverflowProvider extends BaseProvider {
  private stackoverflow: AxiosInstance;
  private providerConfig: StackOverflowProviderConfig;

  constructor(config: StackOverflowProviderConfig) {
    super(config);
    this.providerConfig = config;
    this.stackoverflow = axios.create({
      baseURL: 'https://api.stackexchange.com/2.3',
    });
  }

  get providerName(): string {
    return 'stackoverflow';
  }

  get description(): string {
    return 'Estatísticas de reputação e badges do Stack Overflow';
  }

  async validateConfig(): Promise<boolean> {
    try {
      const site = this.providerConfig.site || 'stackoverflow';
      const response = await this.stackoverflow.get(
        `/users/${this.providerConfig.userId}?site=${site}`
      );
      return response.status === 200 && response.data.items.length > 0;
    } catch (error) {
      console.error('Erro ao validar configuração do Stack Overflow:', error);
      return false;
    }
  }

  async fetchData(): Promise<Record<string, unknown>> {
    try {
      const site = this.providerConfig.site || 'stackoverflow';

      // Buscar dados do usuário
      const userResponse = await this.stackoverflow.get(
        `/users/${this.providerConfig.userId}?site=${site}&filter=!9Z(-wQ0Bf`
      );
      const user = userResponse.data.items[0];

      // Buscar badges
      const badgesResponse = await this.stackoverflow.get(
        `/users/${this.providerConfig.userId}/badges?site=${site}`
      );
      const badges = badgesResponse.data.items;

      // Buscar tags mais usadas
      const tagsResponse = await this.stackoverflow.get(
        `/users/${this.providerConfig.userId}/tags?site=${site}&order=desc&sort=popular`
      );
      const tags = tagsResponse.data.items.slice(0, 5);

      // Buscar atividade recente
      const activityResponse = await this.stackoverflow.get(
        `/users/${this.providerConfig.userId}/posts?site=${site}&order=desc&sort=activity&pagesize=5`
      );
      const activity = activityResponse.data.items;

      // Calcular badges por tipo
      const badgeCounts = badges.reduce(
        (acc: any, badge: any) => {
          acc[badge.rank] = (acc[badge.rank] || 0) + 1;
          return acc;
        },
        { gold: 0, silver: 0, bronze: 0 }
      );

      return {
        reputation: user.reputation,
        badgeCounts,
        totalBadges: badges.length,
        topTags: tags.map((tag: any) => ({
          name: tag.name,
          count: tag.count,
        })),
        recentActivity: activity.map((post: any) => ({
          title: post.title,
          score: post.score,
          link: post.link,
        })),
      };
    } catch (error) {
      console.error('Erro ao buscar dados do Stack Overflow:', error);
      throw new Error('Falha ao buscar dados do Stack Overflow');
    }
  }

  generateContent(data: Record<string, unknown>): string {
    const stats = data as unknown as StackOverflowStats;
    const {
      reputation,
      badgeCounts,
      totalBadges,
      topTags,
      recentActivity,
    } = stats;

    const tagList = topTags
      .map(tag => `${tag.name} (${tag.count})`)
      .join(', ');

    const activityList = recentActivity
      .map(activity => `- [${activity.title}](${activity.link}) (${activity.score} pontos)`)
      .join('\n');

    return `
## 🏆 Stack Overflow Stats

- **Reputação:** ${reputation.toLocaleString()}
- **Badges:** 🥇 ${badgeCounts.gold} | 🥈 ${badgeCounts.silver} | 🥉 ${badgeCounts.bronze}
- **Total de Badges:** ${totalBadges}

### 🏷️ Tags Mais Usadas
${tagList}

### 📝 Atividade Recente
${activityList}
    `.trim();
  }
}
