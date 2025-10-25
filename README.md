# 🚀 GitHub Dyno-Badges

[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

> **Uma GitHub Action open-source que gera badges dinâmicos e estatísticas para perfis GitHub com arquitetura modular e fácil extensão.**

## ✨ Características

- 🎯 **Zero Infraestrutura**: Roda no GitHub Actions do usuário
- 🔧 **Modular**: Fácil adicionar novos providers
- 🛡️ **Type-Safe**: TypeScript previne erros de contribuidores
- 📚 **Bem Documentado**: Foco em Developer Experience
- 🌟 **Community-First**: Arquitetura pensada para PRs externos
- ⚡ **Performance**: Processamento otimizado e cache inteligente

## 🎬 Demonstração

![Demo GIF](https://via.placeholder.com/800x400/1e1e1e/ffffff?text=Demo+Coming+Soon)

## 🚀 Quick Start

### 1. Configuração Básica

Crie um arquivo `.github/workflows/update-profile.yml` no seu repositório:

```yaml
name: Update Profile

on:
  schedule:
    - cron: '0 */6 * * *'  # A cada 6 horas
  workflow_dispatch:  # Execução manual

jobs:
  update-profile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0

      - name: Update profile with Dyno-Badges
        uses: your-username/github-dyno-badges@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### 2. Template do README

Crie um arquivo `README.template.md`:

```markdown
# Hi there 👋

I'm a passionate developer!

## 📊 GitHub Stats
<!--START:github-->
<!--END:github-->

## ⏱️ Coding Time
<!--START:wakatime-->
<!--END:wakatime-->

## 🏆 Stack Overflow
<!--START:stackoverflow-->
<!--END:stackoverflow-->

## 📝 Latest Articles
<!--START:devto-->
<!--END:devto-->
```

### 3. Configuração (Opcional)

Crie um arquivo `dyno-badges.config.yml`:

```yaml
providers:
  github:
    enabled: true
    config:
      username: 'seu-usuario-github'

  wakatime:
    enabled: true
    config:
      apiKey: ${{ secrets.WAKATIME_API_KEY }}
      username: 'seu-usuario-wakatime'

  stackoverflow:
    enabled: true
    config:
      userId: 'seu-user-id-stackoverflow'
      site: 'stackoverflow'

  devto:
    enabled: true
    config:
      username: 'seu-usuario-devto'

template:
  input: 'README.template.md'
  output: 'README.md'

git:
  commitMessage: '📊 Update profile stats'
  branch: 'main'
```

## 📊 Providers Disponíveis

### 🐙 GitHub Stats
- **Repositórios públicos**
- **Total de estrelas**
- **Seguidores e seguindo**
- **Linguagem principal**
- **Atividade recente**

### ⏱️ WakaTime
- **Tempo total de codificação**
- **Média diária**
- **Linguagens mais usadas**
- **Projetos mais ativos**

### 🏆 Stack Overflow
- **Reputação atual**
- **Badges (ouro, prata, bronze)**
- **Tags mais usadas**
- **Atividade recente**

### 📝 Dev.to
- **Últimos artigos**
- **Total de reações**
- **Tags principais**

## 🔧 Configuração Avançada

### Inputs da Action

| Input | Descrição | Padrão | Obrigatório |
|-------|-----------|--------|-------------|
| `github-token` | Token GitHub para autenticação | `${{ github.token }}` | ❌ |
| `config-file` | Caminho do arquivo de configuração | `dyno-badges.config.yml` | ❌ |
| `template-file` | Caminho do template | `README.template.md` | ❌ |
| `output-file` | Arquivo de saída | `README.md` | ❌ |
| `commit-message` | Mensagem de commit | `Update profile stats` | ❌ |
| `branch` | Branch para push | `main` | ❌ |

### Outputs da Action

| Output | Descrição |
|--------|-----------|
| `success` | Indica se a execução foi bem-sucedida |
| `changes` | Indica se houve mudanças no repositório |

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/your-username/github-dyno-badges.git
cd github-dyno-badges

# Instale as dependências
npm install

# Compile o projeto
npm run build

# Execute os testes
npm test
```

### Scripts Disponíveis

```bash
npm run build          # Compila o TypeScript
npm run test           # Executa os testes
npm run test:watch     # Executa testes em modo watch
npm run lint           # Executa o linter
npm run lint:fix       # Corrige problemas do linter
npm run format         # Formata o código
```

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Veja nosso [Guia de Contribuição](CONTRIBUTING.md) para detalhes.

### Como Adicionar um Novo Provider

1. **Crie uma nova classe** em `src/providers/`:
```typescript
export class MeuProvider extends BaseProvider {
  // Implemente os métodos obrigatórios
}
```

2. **Adicione ao factory** em `src/providers/provider.factory.ts`:
```typescript
case 'meu-provider':
  return new MeuProvider(config as MeuProviderConfig);
```

3. **Atualize a configuração** em `src/config/config.service.ts`

4. **Adicione testes** em `src/__tests__/providers/`

5. **Documente** no README e CONTRIBUTING.md

### Processo de Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📚 Documentação

- [Guia de Configuração](docs/configuration.md)
- [API Reference](docs/api.md)
- [Exemplos](examples/)
- [Troubleshooting](docs/troubleshooting.md)

## 🎯 Roadmap

- [ ] **v1.1**: Suporte a Medium, Hashnode
- [ ] **v1.2**: Badges customizados SVG
- [ ] **v1.3**: Integração com LeetCode, HackerRank
- [ ] **v1.4**: Dashboard web para configuração
- [ ] **v2.0**: Microsserviço para badges em tempo real

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) pela inspiração
- Comunidade GitHub por feedback e sugestões
- Todos os contribuidores que tornam este projeto possível

## 📞 Suporte

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/github-dyno-badges/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/your-username/github-dyno-badges/discussions)
- 💬 **Discord**: [Comunidade](https://discord.gg/your-discord)
- 📧 **Email**: support@dyno-badges.dev

---

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge" alt="Made with ❤️">
  <img src="https://img.shields.io/badge/Powered%20by-Dyno%20Badges-blue?style=for-the-badge&logo=github" alt="Powered by Dyno Badges">
</p>

<p align="center">
  <strong>⭐ Se este projeto te ajudou, considere dar uma estrela! ⭐</strong>
</p>
