import * as fs from 'fs';
import * as path from 'path';

export interface TemplateConfig {
  templateFile: string;
  outputFile: string;
  placeholders: Record<string, string>;
}

export class TemplateService {
  private templatePath: string;
  private outputPath: string;

  constructor(templatePath: string, outputPath: string) {
    this.templatePath = templatePath;
    this.outputPath = outputPath;
  }

  /**
   * Lê o arquivo template e substitui os placeholders
   */
  async processTemplate(placeholders: Record<string, string>): Promise<string> {
    try {
      // Verificar se o arquivo template existe
      if (!fs.existsSync(this.templatePath)) {
        throw new Error(`Arquivo template não encontrado: ${this.templatePath}`);
      }

      // Ler o conteúdo do template
      let templateContent = fs.readFileSync(this.templatePath, 'utf-8');

      // Substituir cada placeholder
      for (const [key, value] of Object.entries(placeholders)) {
        const placeholderRegex = new RegExp(
          `<!--START:${key}-->[\\s\\S]*?<!--END:${key}-->`,
          'g'
        );

        const replacement = `<!--START:${key}-->\n${value}\n<!--END:${key}-->`;
        templateContent = templateContent.replace(placeholderRegex, replacement);
      }

      return templateContent;
    } catch (error) {
      console.error('Erro ao processar template:', error);
      if (error instanceof Error && error.message.includes('não encontrado')) {
        throw error;
      }
      throw new Error('Falha ao processar template');
    }
  }

  /**
   * Salva o conteúdo processado no arquivo de saída
   */
  async saveOutput(content: string): Promise<void> {
    try {
      // Criar diretório se não existir
      const outputDir = path.dirname(this.outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Salvar o arquivo
      fs.writeFileSync(this.outputPath, content, 'utf-8');
      console.log(`Arquivo salvo: ${this.outputPath}`);
    } catch (error) {
      console.error('Erro ao salvar arquivo:', error);
      throw new Error('Falha ao salvar arquivo de saída');
    }
  }

  /**
   * Processa o template e salva o resultado
   */
  async processAndSave(placeholders: Record<string, string>): Promise<void> {
    const processedContent = await this.processTemplate(placeholders);
    await this.saveOutput(processedContent);
  }

  /**
   * Verifica se o template contém os placeholders necessários
   */
  validateTemplate(requiredPlaceholders: string[]): boolean {
    try {
      if (!fs.existsSync(this.templatePath)) {
        return false;
      }

      const templateContent = fs.readFileSync(this.templatePath, 'utf-8');

      for (const placeholder of requiredPlaceholders) {
        const startTag = `<!--START:${placeholder}-->`;
        const endTag = `<!--END:${placeholder}-->`;

        if (!templateContent.includes(startTag) || !templateContent.includes(endTag)) {
          console.warn(`Placeholder não encontrado no template: ${placeholder}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Erro ao validar template:', error);
      return false;
    }
  }

  /**
   * Lista todos os placeholders encontrados no template
   */
  extractPlaceholders(): string[] {
    try {
      if (!fs.existsSync(this.templatePath)) {
        return [];
      }

      const templateContent = fs.readFileSync(this.templatePath, 'utf-8');
      const placeholderRegex = /<!--START:([^-->]+)-->/g;
      const placeholders: string[] = [];
      let match;

      while ((match = placeholderRegex.exec(templateContent)) !== null) {
        placeholders.push(match[1]);
      }

      return [...new Set(placeholders)]; // Remove duplicatas
    } catch (error) {
      console.error('Erro ao extrair placeholders:', error);
      return [];
    }
  }
}
