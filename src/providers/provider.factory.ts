import { BaseProvider } from './base.provider';
import { GitHubProvider, GitHubProviderConfig } from './github.provider';
import { WakaTimeProvider, WakaTimeProviderConfig } from './wakatime.provider';
import { StackOverflowProvider, StackOverflowProviderConfig } from './stackoverflow.provider';
import { DevToProvider, DevToProviderConfig } from './devto.provider';

export type ProviderConfig =
  | GitHubProviderConfig
  | WakaTimeProviderConfig
  | StackOverflowProviderConfig
  | DevToProviderConfig;

export class ProviderFactory {
  /**
   * Cria uma instância de provider baseada no nome e configuração
   */
  static createProvider(name: string, config: ProviderConfig): BaseProvider {
    switch (name.toLowerCase()) {
      case 'github':
        return new GitHubProvider(config as GitHubProviderConfig);

      case 'wakatime':
        return new WakaTimeProvider(config as WakaTimeProviderConfig);

      case 'stackoverflow':
        return new StackOverflowProvider(config as StackOverflowProviderConfig);

      case 'devto':
        return new DevToProvider(config as DevToProviderConfig);

      default:
        throw new Error(`Provider não suportado: ${name}`);
    }
  }

  /**
   * Lista todos os providers disponíveis
   */
  static getAvailableProviders(): string[] {
    return ['github', 'wakatime', 'stackoverflow', 'devto'];
  }

  /**
   * Verifica se um provider é suportado
   */
  static isProviderSupported(name: string): boolean {
    return this.getAvailableProviders().includes(name.toLowerCase());
  }

  /**
   * Obtém informações sobre um provider
   */
  static getProviderInfo(name: string): { name: string; description: string } {
    const providers: Record<string, { name: string; description: string }> = {
      github: {
        name: 'GitHub',
        description: 'Estatísticas do perfil GitHub (repositórios, estrelas, seguidores, linguagens)',
      },
      wakatime: {
        name: 'WakaTime',
        description: 'Estatísticas de tempo de codificação do WakaTime',
      },
      stackoverflow: {
        name: 'Stack Overflow',
        description: 'Estatísticas de reputação e badges do Stack Overflow',
      },
      devto: {
        name: 'Dev.to',
        description: 'Últimos artigos publicados no Dev.to',
      },
    };

    return providers[name.toLowerCase()] || { name, description: 'Provider desconhecido' };
  }
}
