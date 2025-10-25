import * as fs from 'fs';
import * as yaml from 'yaml';
import { z } from 'zod';

// Schema de validação para configuração geral
export const ConfigSchema = z.object({
  providers: z.record(z.object({
    enabled: z.boolean().default(true),
    config: z.record(z.unknown()).optional(),
  })),
  template: z.object({
    input: z.string().default('README.template.md'),
    output: z.string().default('README.md'),
  }),
  git: z.object({
    commitMessage: z.string().default('Update profile stats'),
    branch: z.string().default('main'),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

// Schemas específicos para cada provider
export const GitHubConfigSchema = z.object({
  username: z.string(),
  token: z.string().optional(),
});

export const WakaTimeConfigSchema = z.object({
  apiKey: z.string(),
  username: z.string().optional(),
});

export const StackOverflowConfigSchema = z.object({
  userId: z.string(),
  site: z.string().default('stackoverflow'),
});

export const DevToConfigSchema = z.object({
  username: z.string(),
});

export class ConfigService {
  private config: Config;
  private configPath: string;

  constructor(configPath: string = 'dyno-badges.config.yml') {
    this.configPath = configPath;
    this.config = this.loadDefaultConfig();
  }

  /**
   * Carrega configuração padrão
   */
  private loadDefaultConfig(): Config {
    return {
      providers: {
        github: {
          enabled: true,
          config: {},
        },
        wakatime: {
          enabled: false,
          config: {},
        },
        stackoverflow: {
          enabled: false,
          config: {},
        },
        devto: {
          enabled: false,
          config: {},
        },
      },
      template: {
        input: 'README.template.md',
        output: 'README.md',
      },
      git: {
        commitMessage: 'Update profile stats',
        branch: 'main',
      },
    };
  }

  /**
   * Carrega configuração do arquivo YAML
   */
  async loadConfig(): Promise<Config> {
    try {
      if (!fs.existsSync(this.configPath)) {
        console.log(`Arquivo de configuração não encontrado: ${this.configPath}`);
        console.log('Usando configuração padrão');
        return this.config;
      }

      const configContent = fs.readFileSync(this.configPath, 'utf-8');
      const parsedConfig = yaml.parse(configContent);

      // Validar configuração
      this.config = ConfigSchema.parse(parsedConfig);
      console.log('Configuração carregada com sucesso');

      return this.config;
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      console.log('Usando configuração padrão');
      return this.config;
    }
  }

  /**
   * Salva configuração no arquivo YAML
   */
  async saveConfig(): Promise<void> {
    try {
      const yamlContent = yaml.stringify(this.config, {
        indent: 2,
        lineWidth: 80,
      });

      fs.writeFileSync(this.configPath, yamlContent, 'utf-8');
      console.log(`Configuração salva em: ${this.configPath}`);
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      throw new Error('Falha ao salvar configuração');
    }
  }

  /**
   * Obtém configuração de um provider específico
   */
  getProviderConfig(providerName: string): { enabled: boolean; config: Record<string, unknown> } {
    const provider = this.config.providers[providerName];
    if (!provider) {
      return { enabled: false, config: {} };
    }
    return {
      enabled: provider.enabled,
      config: provider.config || {}
    };
  }

  /**
   * Verifica se um provider está habilitado
   */
  isProviderEnabled(providerName: string): boolean {
    const providerConfig = this.getProviderConfig(providerName);
    return providerConfig.enabled;
  }

  /**
   * Habilita/desabilita um provider
   */
  setProviderEnabled(providerName: string, enabled: boolean): void {
    if (!this.config.providers[providerName]) {
      this.config.providers[providerName] = { enabled, config: {} };
    } else {
      this.config.providers[providerName].enabled = enabled;
    }
  }

  /**
   * Define configuração de um provider
   */
  setProviderConfig(providerName: string, config: Record<string, unknown>): void {
    if (!this.config.providers[providerName]) {
      this.config.providers[providerName] = { enabled: true, config };
    } else {
      this.config.providers[providerName].config = config;
    }
  }

  /**
   * Obtém lista de providers habilitados
   */
  getEnabledProviders(): string[] {
    return Object.entries(this.config.providers)
      .filter(([, config]) => config.enabled)
      .map(([name]) => name);
  }

  /**
   * Obtém configuração do template
   */
  getTemplateConfig(): { input: string; output: string } {
    return this.config.template;
  }

  /**
   * Obtém configuração do Git
   */
  getGitConfig(): { commitMessage: string; branch: string } {
    return this.config.git;
  }

  /**
   * Cria arquivo de configuração de exemplo
   */
  async createExampleConfig(): Promise<void> {
    const exampleConfig = {
      providers: {
        github: {
          enabled: true,
          config: {
            username: 'seu-usuario-github',
            token: 'seu-token-opcional', // Opcional, para rate limits maiores
          },
        },
        wakatime: {
          enabled: false,
          config: {
            apiKey: 'seu-api-key-wakatime',
            username: 'seu-usuario-wakatime', // Opcional
          },
        },
        stackoverflow: {
          enabled: false,
          config: {
            userId: 'seu-user-id-stackoverflow',
            site: 'stackoverflow', // ou 'pt.stackoverflow'
          },
        },
        devto: {
          enabled: false,
          config: {
            username: 'seu-usuario-devto',
          },
        },
      },
      template: {
        input: 'README.template.md',
        output: 'README.md',
      },
      git: {
        commitMessage: 'Update profile stats',
        branch: 'main',
      },
    };

    const yamlContent = yaml.stringify(exampleConfig, {
      indent: 2,
      lineWidth: 80,
    });

    const examplePath = 'dyno-badges.config.example.yml';
    fs.writeFileSync(examplePath, yamlContent, 'utf-8');
    console.log(`Arquivo de exemplo criado: ${examplePath}`);
  }
}
