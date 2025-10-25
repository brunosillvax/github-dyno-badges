import { z } from 'zod';

/**
 * Schema de validação para configuração base de um provider
 */
export const BaseProviderConfigSchema = z.object({
  enabled: z.boolean().default(true),
  name: z.string(),
  description: z.string().optional(),
});

export type BaseProviderConfig = z.infer<typeof BaseProviderConfigSchema>;

/**
 * Interface abstrata que todos os providers devem implementar
 */
export abstract class BaseProvider {
  protected config: BaseProviderConfig;

  constructor(config: BaseProviderConfig) {
    this.config = config;
  }

  /**
   * Nome único do provider (usado como identificador)
   */
  abstract get providerName(): string;

  /**
   * Descrição do que este provider faz
   */
  abstract get description(): string;

  /**
   * Valida se o provider está configurado corretamente
   */
  abstract validateConfig(): Promise<boolean>;

  /**
   * Busca os dados do provider
   */
  abstract fetchData(): Promise<Record<string, unknown>>;

  /**
   * Gera o conteúdo que será inserido no template
   */
  abstract generateContent(data: Record<string, unknown>): string;

  /**
   * Verifica se o provider está habilitado
   */
  get isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Executa o provider completo: busca dados e gera conteúdo
   */
  async execute(): Promise<string> {
    if (!this.isEnabled) {
      return '';
    }

    const isValid = await this.validateConfig();
    if (!isValid) {
      throw new Error(`Configuração inválida para o provider ${this.providerName}`);
    }

    const data = await this.fetchData();
    return this.generateContent(data);
  }
}
