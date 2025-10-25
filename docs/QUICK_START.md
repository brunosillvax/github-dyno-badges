# 🚀 Início Rápido - GitHub Dyno-Badges

Este guia te ajudará a configurar o GitHub Dyno-Badges em seu perfil GitHub em menos de 5 minutos!

## 📋 Pré-requisitos

- Um perfil GitHub (repositório com seu username, ex: `seu-usuario/seu-usuario`)
- Permissões de escrita no repositório
- 5 minutos do seu tempo ⏱️

## 🔧 Passo a Passo

### 1. Criar o Workflow

No seu repositório de perfil, crie o arquivo `.github/workflows/update-profile.yml`:

```yaml
name: Update Profile

on:
  schedule:
    - cron: '0 */6 * * *' # Atualiza a cada 6 horas
  workflow_dispatch: # Permite execução manual

jobs:
  update-profile:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0

      - name: Update profile with Dyno-Badges
        uses: seu-usuario/github-dyno-badges@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### 2. Criar o Template

Crie o arquivo `README.template.md`:

```markdown
# Hi there 👋

I'm a passionate developer!

## 📊 GitHub Stats

<!--START:github-->
<!--END:github-->
```

### 3. Configuração (Opcional)

Crie o arquivo `dyno-badges.config.yml`:

```yaml
providers:
  github:
    enabled: true
    config:
      username: 'seu-usuario-github'
```

### 4. Testar

1. Vá em **Actions** no seu repositório
2. Selecione o workflow **Update Profile**
3. Clique em **Run workflow**
4. Aguarde a execução
5. Verifique o `README.md` atualizado!

## ✅ Pronto!

Seu perfil GitHub agora tem estatísticas dinâmicas!

## 🎨 Próximos Passos

- [ ] Adicionar mais providers (WakaTime, StackOverflow, etc.)
- [ ] Personalizar o template
- [ ] Configurar atualização automática

## 🆘 Problemas?

Consulte nossa documentação completa ou abra uma issue no GitHub!
