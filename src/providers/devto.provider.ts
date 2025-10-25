import axios, { AxiosInstance } from 'axios';
import { BaseProvider, BaseProviderConfig } from './base.provider';

export interface DevToProviderConfig extends BaseProviderConfig {
  username: string;
}

export interface DevToStats {
  articles: Array<{
    title: string;
    url: string;
    publishedAt: string;
    tags: string[];
    readingTime: number;
    reactions: number;
  }>;
  totalArticles: number;
  totalReactions: number;
  topTags: string[];
}

export class DevToProvider extends BaseProvider {
  private devto: AxiosInstance;
  private providerConfig: DevToProviderConfig;

  constructor(config: DevToProviderConfig) {
    super(config);
    this.providerConfig = config;
    this.devto = axios.create({
      baseURL: 'https://dev.to/api',
    });
  }

  get providerName(): string {
    return 'devto';
  }

  get description(): string {
    return 'Últimos artigos publicados no Dev.to';
  }

  async validateConfig(): Promise<boolean> {
    try {
      const response = await this.devto.get(`/users/by_username?url=${this.providerConfig.username}`);
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao validar configuração do Dev.to:', error);
      return false;
    }
  }

  async fetchData(): Promise<Record<string, unknown>> {
    try {
      // Buscar artigos do usuário
      const articlesResponse = await this.devto.get(`/articles?username=${this.providerConfig.username}&per_page=10`);
      const articles = articlesResponse.data;

      // Calcular estatísticas
      const totalReactions = articles.reduce(
        (sum: number, article: any) => sum + article.public_reactions_count,
        0
      );

      // Extrair tags únicas
      const allTags = articles.flatMap((article: any) => article.tag_list);
      const tagCounts = allTags.reduce((acc: any, tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});

      const topTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([tag]) => tag);

      return {
        articles: articles.slice(0, 5).map((article: any) => ({
          title: article.title,
          url: article.url,
          publishedAt: article.published_at,
          tags: article.tag_list,
          readingTime: article.reading_time_minutes,
          reactions: article.public_reactions_count,
        })),
        totalArticles: articles.length,
        totalReactions,
        topTags,
      };
    } catch (error) {
      console.error('Erro ao buscar dados do Dev.to:', error);
      throw new Error('Falha ao buscar dados do Dev.to');
    }
  }

  generateContent(data: Record<string, unknown>): string {
    const stats = data as unknown as DevToStats;
    const { articles, totalArticles, totalReactions, topTags } = stats;

    const articleList = articles
      .map(article => {
        const date = new Date(article.publishedAt).toLocaleDateString('pt-BR');
        return `- [${article.title}](${article.url}) (${date}) - ${article.reactions} ❤️`;
      })
      .join('\n');

    const tagList = topTags.join(', ');

    return `
## 📝 Dev.to Articles

- **Total de Artigos:** ${totalArticles}
- **Total de Reações:** ${totalReactions} ❤️
- **Tags Principais:** ${tagList}

### 📖 Últimos Artigos
${articleList}
    `.trim();
  }
}
