# 🚀 Guia de Setup - GitHub Dyno-Badges

Este guia te ajudará a configurar e usar o GitHub Dyno-Badges em seu perfil GitHub.

## 📋 Pré-requisitos

- Conta no GitHub
- Repositório com perfil (username/username)
- Conhecimento básico de GitHub Actions (opcional)

## 🎯 Setup Rápido (5 minutos)

### 1. Fork do Repositório

1. Acesse [github-dyno-badges](https://github.com/your-username/github-dyno-badges)
2. Clique em "Fork" no canto superior direito
3. Clone seu fork localmente:

```bash
git clone https://github.com/SEU-USERNAME/github-dyno-badges.git
cd github-dyno-badges
```

### 2. Configuração do Repositório

1. **Crie um repositório com seu username** (ex: `bruno/bruno`)
2. **Ative GitHub Pages** (Settings > Pages > Source: Deploy from a branch > main)
3. **Clone o repositório**:

```bash
git clone https://github.com/SEU-USERNAME/SEU-USERNAME.git
cd SEU-USERNAME
```

### 3. Configuração Básica

1. **Copie os arquivos de exemplo**:

```bash
# Copie o workflow
cp ../github-dyno-badges/.github/workflows/update-profile.yml .github/workflows/

# Copie o template
cp ../github-dyno-badges/README.template.md .

# Copie a configuração
cp ../github-dyno-badges/dyno-badges.config.example.yml dyno-badges.config.yml
```

2. **Edite a configuração** (`dyno-badges.config.yml`):

```yaml
providers:
  github:
    enabled: true
    config:
      username: 'SEU-USERNAME-GITHUB'  # ← Altere aqui

  wakatime:
    enabled: false  # ← Habilite se tiver WakaTime
    config:
      apiKey: 'SUA-API-KEY-WAKATIME'

  stackoverflow:
    enabled: false  # ← Habilite se quiser
    config:
      userId: 'SEU-USER-ID-STACKOVERFLOW'

  devto:
    enabled: false  # ← Habilite se tiver Dev.to
    config:
      username: 'SEU-USERNAME-DEVTO'
```

### 4. Personalize o Template

Edite `README.template.md` com suas informações:

```markdown
# Hi there 👋

I'm [SEU NOME], a passionate developer!

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

## 🛠️ Tech Stack
- **Languages:** JavaScript, TypeScript, Python
- **Frameworks:** React, Node.js, Express
- **Tools:** Git, Docker, AWS

## 📫 How to reach me
- **Email:** seu.email@example.com
- **LinkedIn:** [Seu LinkedIn](https://linkedin.com/in/seu-perfil)
- **Twitter:** [@seuusername](https://twitter.com/seuusername)
```

### 5. Configure Secrets (Opcional)

Se você quiser usar providers que precisam de API keys:

1. Vá em **Settings > Secrets and variables > Actions**
2. Adicione os secrets necessários:
   - `WAKATIME_API_KEY` (se usar WakaTime)
   - `STACKOVERFLOW_USER_ID` (se usar Stack Overflow)

### 6. Ative o Workflow

1. Vá em **Actions** no seu repositório
2. Clique em **"Update Profile"**
3. Clique em **"Run workflow"**
4. Aguarde a execução (2-3 minutos)

### 7. Verifique o Resultado

1. Vá para `https://SEU-USERNAME.github.io/SEU-USERNAME/`
2. Ou veja o arquivo `README.md` no seu repositório
3. As estatísticas devem aparecer automaticamente!

## 🔧 Configuração Avançada

### Providers Adicionais

#### WakaTime
1. Acesse [WakaTime](https://wakatime.com)
2. Vá em **Settings > API Keys**
3. Copie sua API Key
4. Adicione como secret `WAKATIME_API_KEY`

#### Stack Overflow
1. Acesse seu perfil no Stack Overflow
2. Copie o número da URL (ex: `/users/123456/username`)
3. Configure no `dyno-badges.config.yml`

#### Dev.to
1. Acesse [Dev.to](https://dev.to)
2. Copie seu username da URL
3. Configure no `dyno-badges.config.yml`

### Personalização do Template

Você pode personalizar completamente o template:

```markdown
# Seu Nome

Sua bio aqui...

## 🎯 Objetivos 2024
- [ ] Meta 1
- [ ] Meta 2

## 📊 Estatísticas
<!--START:github-->
<!--END:github-->

## 🏆 Conquistas
<!--START:stackoverflow-->
<!--END:stackoverflow-->

## 📝 Últimos Artigos
<!--START:devto-->
<!--END:devto-->

## 🛠️ Stack Técnico
- Frontend: React, Vue, Angular
- Backend: Node.js, Python, Go
- Cloud: AWS, GCP, Azure

## 📞 Contato
- Email: seu@email.com
- LinkedIn: [seu-perfil](https://linkedin.com/in/seu-perfil)
- Twitter: [@seuusername](https://twitter.com/seuusername)
```

### Agendamento Personalizado

Edite `.github/workflows/update-profile.yml`:

```yaml
on:
  schedule:
    - cron: '0 */4 * * *'  # A cada 4 horas
    - cron: '0 9 * * 1'   # Toda segunda às 9h
  workflow_dispatch:      # Execução manual
```

## 🐛 Troubleshooting

### Problema: Workflow não executa
**Solução**: Verifique se o arquivo está em `.github/workflows/`

### Problema: Erro de permissão
**Solução**: Verifique se o token `GITHUB_TOKEN` está configurado

### Problema: Template não atualiza
**Solução**: Verifique se o arquivo `README.template.md` existe

### Problema: Providers não funcionam
**Solução**: Verifique as configurações no `dyno-badges.config.yml`

### Problema: API rate limit
**Solução**: Adicione um token GitHub pessoal como secret

## 📚 Próximos Passos

1. **Personalize** seu template com suas informações
2. **Adicione** mais providers conforme necessário
3. **Contribua** com melhorias no projeto
4. **Compartilhe** com outros desenvolvedores

## 🆘 Suporte

- 🐛 **Bugs**: [GitHub Issues](https://github.com/your-username/github-dyno-badges/issues)
- 💡 **Sugestões**: [GitHub Discussions](https://github.com/your-username/github-dyno-badges/discussions)
- 📧 **Email**: support@dyno-badges.dev
- 💬 **Discord**: [Comunidade](https://discord.gg/your-discord)

## 🎉 Exemplos

Veja perfis que usam o Dyno-Badges:

- [Exemplo 1](https://github.com/exemplo1/exemplo1)
- [Exemplo 2](https://github.com/exemplo2/exemplo2)
- [Exemplo 3](https://github.com/exemplo3/exemplo3)

---

<p align="center">
  <strong>🚀 Pronto! Seu perfil GitHub agora é dinâmico e sempre atualizado!</strong>
</p>
