import * as fs from 'fs';
import { TemplateService } from '../../services/template.service';

// Mock do fs
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('TemplateService', () => {
  let templateService: TemplateService;
  const templatePath = 'README.template.md';
  const outputPath = 'README.md';

  beforeEach(() => {
    templateService = new TemplateService(templatePath, outputPath);
    jest.clearAllMocks();
  });

  describe('processTemplate', () => {
    it('deve substituir placeholders corretamente', async () => {
      const templateContent = `
# Meu Perfil

<!--START:github-->
Conteúdo antigo do GitHub
<!--END:github-->

<!--START:wakatime-->
Conteúdo antigo do WakaTime
<!--END:wakatime-->
      `;

      const placeholders = {
        github: 'Novo conteúdo do GitHub',
        wakatime: 'Novo conteúdo do WakaTime',
      };

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(templateContent);

      const result = await templateService.processTemplate(placeholders);

      expect(result).toContain('Novo conteúdo do GitHub');
      expect(result).toContain('Novo conteúdo do WakaTime');
      expect(result).not.toContain('Conteúdo antigo');
    });

    it('deve lançar erro quando template não existe', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      await expect(templateService.processTemplate({})).rejects.toThrow(
        'Arquivo template não encontrado'
      );
    });
  });

  describe('saveOutput', () => {
    it('deve salvar arquivo corretamente', async () => {
      const content = 'Conteúdo do README';
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.mkdirSync.mockImplementation(() => undefined);
      mockedFs.writeFileSync.mockImplementation(() => undefined);

      await templateService.saveOutput(content);

      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(outputPath, content, 'utf-8');
    });

    it('deve criar diretório se não existir', async () => {
      const content = 'Conteúdo do README';
      mockedFs.existsSync.mockReturnValue(false);
      mockedFs.mkdirSync.mockImplementation(() => undefined);
      mockedFs.writeFileSync.mockImplementation(() => undefined);

      await templateService.saveOutput(content);

      expect(mockedFs.mkdirSync).toHaveBeenCalledWith(expect.any(String), { recursive: true });
    });
  });

  describe('validateTemplate', () => {
    it('deve retornar true para template válido', () => {
      const templateContent = `
<!--START:github-->
<!--END:github-->
<!--START:wakatime-->
<!--END:wakatime-->
      `;

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(templateContent);

      const result = templateService.validateTemplate(['github', 'wakatime']);
      expect(result).toBe(true);
    });

    it('deve retornar false para template inválido', () => {
      const templateContent = `
<!--START:github-->
<!--END:github-->
      `;

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(templateContent);

      const result = templateService.validateTemplate(['github', 'wakatime']);
      expect(result).toBe(false);
    });
  });

  describe('extractPlaceholders', () => {
    it('deve extrair placeholders únicos', () => {
      const templateContent = `
<!--START:github-->
<!--END:github-->
<!--START:wakatime-->
<!--END:wakatime-->
<!--START:github-->
<!--END:github-->
      `;

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(templateContent);

      const result = templateService.extractPlaceholders();
      expect(result).toEqual(['github', 'wakatime']);
    });

    it('deve retornar array vazio para template sem placeholders', () => {
      const templateContent = 'Conteúdo sem placeholders';

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(templateContent);

      const result = templateService.extractPlaceholders();
      expect(result).toEqual([]);
    });
  });
});
