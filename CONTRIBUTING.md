# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o GitHub Dyno-Badges! Este documento fornece diretrizes para contribuições.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Adicionando Novos Providers](#adicionando-novos-providers)
- [Padrões de Código](#padrões-de-código)
- [Testes](#testes)
- [Documentação](#documentação)
- [Processo de Pull Request](#processo-de-pull-request)

## 📜 Código de Conduta

Este projeto segue o [Código de Conduta do Contributor Covenant](CODE_OF_CONDUCT.md). Ao participar, você concorda em manter este código.

## 🚀 Como Contribuir

### Tipos de Contribuições

- 🐛 **Bug Reports**: Reporte bugs encontrados
- 💡 **Feature Requests**: Sugira novas funcionalidades
- 🔧 **Code Contributions**: Implemente melhorias
- 📚 **Documentation**: Melhore a documentação
- 🧪 **Testing**: Adicione ou melhore testes

### Antes de Começar

1. **Verifique se já existe** uma issue ou PR relacionada
2. **Discuta mudanças grandes** em uma issue primeiro
3. **Fork o repositório** e clone localmente
4. **Configure o ambiente** de desenvolvimento

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git
- Editor de código (VS Code recomendado)

### Setup Inicial

```bash
# 1. Fork e clone o repositório
git clone https://github.com/SEU-USERNAME/github-dyno-badges.git
cd github-dyno-badges

# 2. Instale dependências
npm install

# 3. Configure o remote upstream
git remote add upstream https://github.com/ORIGINAL-USERNAME/github-dyno-badges.git

# 4. Crie uma branch para sua feature
git checkout -b feature/sua-feature

# 5. Instale pre-commit hooks (opcional)
npm run prepare
```

### Scripts de Desenvolvimento

```bash
npm run dev          # Modo desenvolvimento com watch
npm run build        # Compila o projeto
npm run test         # Executa todos os testes
npm run test:watch   # Testes em modo watch
npm run lint         # Verifica linting
npm run lint:fix     # Corrige problemas de linting
npm run format       # Formata o código
```

## 📁 Estrutura do Projeto

```
src/
├── providers/           # Providers de dados
│   ├── base.provider.ts
│   ├── github.provider.ts
│   ├── wakatime.provider.ts
│   ├── stackoverflow.provider.ts
│   ├── devto.provider.ts
│   └── provider.factory.ts
├── services/           # Serviços principais
│   ├── template.service.ts
│   └── git.service.ts
├── config/            # Configuração
│   └── config.service.ts
├── utils/             # Utilitários
│   └── logger.ts
└── index.ts           # Entry point

__tests__/             # Testes
├── providers/
├── services/
└── config/

.github/               # GitHub Actions
├── workflows/
└── ISSUE_TEMPLATE/

docs/                  # Documentação
examples/              # Exemplos de uso
```

## 🔧 Adicionando Novos Providers

### 1. Criar a Classe do Provider

```typescript
// src/providers/meu-provider.provider.ts
import { BaseProvider, BaseProviderConfig } from './base.provider';

export interface MeuProviderConfig extends BaseProviderConfig {
  apiKey: string;
  username?: string;
}

export class MeuProvider extends BaseProvider {
  private config: MeuProviderConfig;

  constructor(config: MeuProviderConfig) {
    super(config);
    this.config = config;
  }

  get providerName(): string {
    return 'meu-provider';
  }

  get description(): string {
    return 'Descrição do que este provider faz';
  }

  async validateConfig(): Promise<boolean> {
    // Implementar validação
    return true;
  }

  async fetchData(): Promise<Record<string, unknown>> {
    // Implementar busca de dados
    return {};
  }

  generateContent(data: Record<string, unknown>): string {
    // Implementar geração de conteúdo
    return '';
  }
}
```

### 2. Adicionar ao Factory

```typescript
// src/providers/provider.factory.ts
import { MeuProvider, MeuProviderConfig } from './meu-provider.provider';

export class ProviderFactory {
  static createProvider(name: string, config: ProviderConfig): BaseProvider {
    switch (name.toLowerCase()) {
      // ... outros cases
      case 'meu-provider':
        return new MeuProvider(config as MeuProviderConfig);
      default:
        throw new Error(`Provider não suportado: ${name}`);
    }
  }
}
```

### 3. Atualizar Configuração

```typescript
// src/config/config.service.ts
export const MeuProviderConfigSchema = z.object({
  apiKey: z.string(),
  username: z.string().optional(),
});

// Adicionar ao schema principal
export const ConfigSchema = z.object({
  providers: z.record(z.object({
    enabled: z.boolean().default(true),
    config: z.record(z.unknown()).optional(),
  })),
  // ... outros campos
});
```

### 4. Criar Testes

```typescript
// src/__tests__/providers/meu-provider.test.ts
import { MeuProvider, MeuProviderConfig } from '../../providers/meu-provider.provider';

describe('MeuProvider', () => {
  let provider: MeuProvider;
  let mockConfig: MeuProviderConfig;

  beforeEach(() => {
    mockConfig = {
      enabled: true,
      name: 'meu-provider',
      apiKey: 'test-key',
      username: 'testuser',
    };
    provider = new MeuProvider(mockConfig);
  });

  // Implementar testes...
});
```

## 📝 Padrões de Código

### TypeScript

- Use **TypeScript strict mode**
- Prefira **interfaces** sobre types quando possível
- Use **enums** para valores constantes
- Documente funções públicas com **JSDoc**

```typescript
/**
 * Busca dados de um provider específico
 * @param providerName Nome do provider
 * @param config Configuração do provider
 * @returns Promise com os dados buscados
 */
async fetchProviderData(providerName: string, config: ProviderConfig): Promise<Data> {
  // implementação
}
```

### Nomenclatura

- **Classes**: PascalCase (`GitHubProvider`)
- **Interfaces**: PascalCase com sufixo apropriado (`ProviderConfig`)
- **Funções**: camelCase (`fetchData`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Arquivos**: kebab-case (`github-provider.ts`)

### Estrutura de Arquivos

```
src/providers/
├── base.provider.ts           # Interface base
├── github.provider.ts         # Provider específico
├── wakatime.provider.ts       # Provider específico
└── provider.factory.ts        # Factory pattern
```

## 🧪 Testes

### Estrutura de Testes

```
__tests__/
├── providers/
│   ├── github.provider.test.ts
│   ├── wakatime.provider.test.ts
│   └── ...
├── services/
│   ├── template.service.test.ts
│   └── git.service.test.ts
└── config/
    └── config.service.test.ts
```

### Escrevendo Testes

```typescript
describe('NomeDoComponente', () => {
  let instance: NomeDoComponente;

  beforeEach(() => {
    // Setup
    instance = new NomeDoComponente(config);
  });

  afterEach(() => {
    // Cleanup
    jest.clearAllMocks();
  });

  describe('método específico', () => {
    it('deve fazer algo quando condição', async () => {
      // Arrange
      const input = 'test';
      const expected = 'expected';

      // Act
      const result = await instance.method(input);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### Cobertura de Testes

- **Mínimo**: 80% de cobertura
- **Ideal**: 90%+ de cobertura
- Execute `npm test -- --coverage` para verificar

## 📚 Documentação

### README.md

- Mantenha atualizado
- Use exemplos práticos
- Inclua screenshots/GIFs quando possível
- Documente breaking changes

### JSDoc

```typescript
/**
 * Classe base para todos os providers
 * @abstract
 * @example
 * ```typescript
 * class MeuProvider extends BaseProvider {
 *   async fetchData() {
 *     return { data: 'example' };
 *   }
 * }
 * ```
 */
export abstract class BaseProvider {
  // ...
}
```

### Changelog

- Use [Keep a Changelog](https://keepachangelog.com/) format
- Documente todas as mudanças públicas
- Agrupe por tipo (Added, Changed, Fixed, etc.)

## 🔄 Processo de Pull Request

### 1. Preparação

```bash
# 1. Sincronize com upstream
git fetch upstream
git checkout main
git merge upstream/main

# 2. Crie uma nova branch
git checkout -b feature/nova-funcionalidade

# 3. Faça suas mudanças
# ... código ...

# 4. Execute testes
npm test
npm run lint
npm run build
```

### 2. Commit

```bash
# Use conventional commits
git add .
git commit -m "feat: adiciona suporte ao provider X"
git commit -m "fix: corrige bug no template service"
git commit -m "docs: atualiza README com novos exemplos"
```

### 3. Push e PR

```bash
# Push para seu fork
git push origin feature/nova-funcionalidade

# Crie Pull Request no GitHub
```

### Template de PR

```markdown
## 📝 Descrição
Breve descrição das mudanças

## 🔗 Issue Relacionada
Closes #123

## 🧪 Testes
- [ ] Testes unitários passando
- [ ] Testes de integração passando
- [ ] Linting passando
- [ ] Build passando

## 📸 Screenshots
Se aplicável, adicione screenshots

## 📋 Checklist
- [ ] Código segue padrões do projeto
- [ ] Documentação atualizada
- [ ] Testes adicionados/atualizados
- [ ] Changelog atualizado
```

## 🐛 Reportando Bugs

### Template de Bug Report

```markdown
**Descrição do Bug**
Descrição clara e concisa do bug.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
- OS: [e.g. Ubuntu 20.04]
- Node.js: [e.g. 18.17.0]
- Versão: [e.g. 1.0.0]

**Logs Adicionais**
Adicione logs relevantes.
```

## 💡 Sugerindo Features

### Template de Feature Request

```markdown
**Sua feature request está relacionada a um problema?**
Descrição clara do problema.

**Descreva a solução que você gostaria**
Descrição clara da solução desejada.

**Descreva alternativas consideradas**
Outras soluções que você considerou.

**Contexto adicional**
Qualquer outro contexto sobre a feature request.
```

## 🏷️ Releases

### Versionamento

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

### Processo de Release

1. **Atualize CHANGELOG.md**
2. **Atualize version no package.json**
3. **Crie tag**: `git tag v1.0.0`
4. **Push tag**: `git push origin v1.0.0`
5. **GitHub Actions** fará o release automaticamente

## 📞 Suporte

- 💬 **Discord**: [Comunidade](https://discord.gg/your-discord)
- 📧 **Email**: contributors@dyno-badges.dev
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/github-dyno-badges/issues)

## 🙏 Agradecimentos

Obrigado por contribuir! Cada contribuição, por menor que seja, faz diferença.

---

<p align="center">
  <strong>Juntos, construímos algo incrível! 🚀</strong>
</p>
