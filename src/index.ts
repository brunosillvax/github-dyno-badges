import * as core from '@actions/core';
import * as github from '@actions/github';
import { ConfigService } from './config/config.service';
import { TemplateService } from './services/template.service';
import { GitService } from './services/git.service';
import { ProviderFactory } from './providers/provider.factory';
import { Logger } from './utils/logger';

async function main(): Promise<void> {
  const logger = Logger.getInstance();

  try {
    logger.info('🚀 Iniciando GitHub Dyno-Badges Action');

    // Carregar configuração
    const configService = new ConfigService();
    await configService.loadConfig();

    logger.info('📋 Configuração carregada');

    // Configurar template service
    const templateConfig = configService.getTemplateConfig();
    const templateService = new TemplateService(
      templateConfig.input,
      templateConfig.output
    );

    // Verificar se o template existe
    if (!templateService.validateTemplate([])) {
      logger.warn('Template não encontrado ou inválido');
      logger.info('Criando template de exemplo...');
      await createExampleTemplate(templateConfig.input);
    }

    // Configurar Git service
    const gitConfig = configService.getGitConfig();
    const gitService = new GitService({
      token: core.getInput('github-token', { required: true }),
      username: github.context.actor,
      email: `${github.context.actor}@users.noreply.github.com`,
      branch: gitConfig.branch,
      commitMessage: gitConfig.commitMessage,
    });

    await gitService.setupGit();
    logger.info('🔧 Git configurado');

    // Processar providers habilitados
    const enabledProviders = configService.getEnabledProviders();
    logger.info(`📊 Providers habilitados: ${enabledProviders.join(', ')}`);

    const placeholders: Record<string, string> = {};

    for (const providerName of enabledProviders) {
      try {
        logger.info(`🔄 Processando provider: ${providerName}`);

        const providerConfig = configService.getProviderConfig(providerName);
        
        // Se for o provider GitHub e não tiver username configurado, usar o actor do contexto
        if (providerName === 'github' && !providerConfig.config?.username) {
          providerConfig.config = {
            ...providerConfig.config,
            username: github.context.actor,
          };
        }
        
        const provider = ProviderFactory.createProvider(providerName, {
          ...providerConfig.config,
          enabled: providerConfig.enabled,
          name: providerName,
        } as any);

        const content = await provider.execute();
        placeholders[providerName] = content;

        logger.info(`✅ Provider ${providerName} processado com sucesso`);
      } catch (error) {
        logger.error(`❌ Erro ao processar provider ${providerName}:`, error as Error);
        // Continuar com outros providers mesmo se um falhar
      }
    }

    // Processar template
    logger.info('📝 Processando template...');
    await templateService.processAndSave(placeholders);
    logger.info('✅ Template processado');

    // Fazer commit e push das mudanças
    logger.info('💾 Salvando mudanças...');
    const gitConfig2 = configService.getGitConfig();
    const templateConfig2 = configService.getTemplateConfig();

    const hasChanges = await gitService.commitAndPush(
      [templateConfig2.output],
      gitConfig2.commitMessage
    );

    if (hasChanges) {
      logger.info('🎉 Perfil atualizado com sucesso!');
    } else {
      logger.info('ℹ️ Nenhuma mudança detectada');
    }

  } catch (error) {
    logger.error('💥 Erro fatal na execução:', error as Error);
    process.exit(1);
  }
}

/**
 * Cria um template de exemplo se não existir
 */
async function createExampleTemplate(templatePath: string): Promise<void> {
  const fs = require('fs');

  const exampleTemplate = `# Hi there 👋

I'm a passionate developer who loves creating amazing things!

<!--START:github-->
<!--END:github-->

<!--START:wakatime-->
<!--END:wakatime-->

<!--START:stackoverflow-->
<!--END:stackoverflow-->

<!--START:devto-->
<!--END:devto-->

## 🛠️ Tech Stack

- **Languages:** JavaScript, TypeScript, Python, Go
- **Frameworks:** React, Node.js, Express
- **Tools:** Git, Docker, AWS

## 📈 GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=YOUR_USERNAME&show_icons=true&theme=dark)

## 🔥 Streak

![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=YOUR_USERNAME&theme=dark)

---

<p align="center">
  <img src="https://img.shields.io/badge/Powered%20by-Dyno%20Badges-blue?style=for-the-badge&logo=github" alt="Powered by Dyno Badges">
</p>
`;

  fs.writeFileSync(templatePath, exampleTemplate, 'utf-8');
  console.log(`Template de exemplo criado: ${templatePath}`);
}

// Executar apenas se for chamado diretamente
if (require.main === module) {
  main().catch((error) => {
    console.error('Erro não tratado:', error);
    process.exit(1);
  });
}

export { main };
