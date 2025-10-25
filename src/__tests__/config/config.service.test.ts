import * as fs from 'fs';
import { ConfigService } from '../../config/config.service';

// Mock do fs
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService('test-config.yml');
    jest.clearAllMocks();
  });

  describe('loadConfig', () => {
    it('deve carregar configuração padrão quando arquivo não existe', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      const config = await configService.loadConfig();

      expect(config.providers.github.enabled).toBe(true);
      expect(config.providers.wakatime.enabled).toBe(false);
      expect(config.template.input).toBe('README.template.md');
    });

    it('deve carregar configuração do arquivo YAML', async () => {
      const yamlContent = `
providers:
  github:
    enabled: true
    config:
      username: 'testuser'
  wakatime:
    enabled: true
    config:
      apiKey: 'test-key'
template:
  input: 'custom-template.md'
  output: 'custom-readme.md'
git:
  commitMessage: 'Test commit'
  branch: 'main'
      `;

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(yamlContent);

      const config = await configService.loadConfig();

      expect(config.providers.github.enabled).toBe(true);
      expect(config.providers.wakatime.enabled).toBe(true);
      expect(config.template.input).toBe('custom-template.md');
    });

    it('deve usar configuração padrão quando arquivo é inválido', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue('invalid yaml content');

      const config = await configService.loadConfig();

      expect(config.providers.github.enabled).toBe(true);
      expect(config.template.input).toBe('README.template.md');
    });
  });

  describe('getProviderConfig', () => {
    it('deve retornar configuração do provider', async () => {
      await configService.loadConfig();

      const githubConfig = configService.getProviderConfig('github');
      expect(githubConfig.enabled).toBe(true);
    });

    it('deve retornar configuração padrão para provider inexistente', async () => {
      await configService.loadConfig();

      const unknownConfig = configService.getProviderConfig('unknown');
      expect(unknownConfig.enabled).toBe(false);
    });
  });

  describe('isProviderEnabled', () => {
    it('deve retornar true para provider habilitado', async () => {
      await configService.loadConfig();

      expect(configService.isProviderEnabled('github')).toBe(true);
    });

    it('deve retornar false para provider desabilitado', async () => {
      await configService.loadConfig();

      expect(configService.isProviderEnabled('wakatime')).toBe(false);
    });
  });

  describe('setProviderEnabled', () => {
    it('deve habilitar/desabilitar provider', async () => {
      await configService.loadConfig();

      configService.setProviderEnabled('wakatime', true);
      expect(configService.isProviderEnabled('wakatime')).toBe(true);

      configService.setProviderEnabled('wakatime', false);
      expect(configService.isProviderEnabled('wakatime')).toBe(false);
    });
  });

  describe('getEnabledProviders', () => {
    it('deve retornar lista de providers habilitados', async () => {
      await configService.loadConfig();

      const enabledProviders = configService.getEnabledProviders();
      expect(enabledProviders).toContain('github');
      expect(enabledProviders).not.toContain('wakatime');
    });
  });

  describe('createExampleConfig', () => {
    it('deve criar arquivo de exemplo', async () => {
      mockedFs.writeFileSync.mockImplementation(() => undefined);

      await configService.createExampleConfig();

      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        'dyno-badges.config.example.yml',
        expect.any(String),
        'utf-8'
      );
    });
  });
});
