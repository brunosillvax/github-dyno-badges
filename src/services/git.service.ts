import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface GitConfig {
  token: string;
  username: string;
  email: string;
  branch?: string;
  commitMessage?: string;
}

export class GitService {
  private config: GitConfig;

  constructor(config: GitConfig) {
    this.config = config;
  }

  /**
   * Configura o Git com as credenciais necessárias
   */
  async setupGit(): Promise<void> {
    try {
      // Configurar usuário e email
      await execAsync(`git config user.name "${this.config.username}"`);
      await execAsync(`git config user.email "${this.config.email}"`);

      // Configurar o token para autenticação
      await execAsync(`git config credential.helper store`);

      console.log('Git configurado com sucesso');
    } catch (error) {
      console.error('Erro ao configurar Git:', error);
      throw new Error('Falha ao configurar Git');
    }
  }

  /**
   * Adiciona arquivos ao staging area
   */
  async addFiles(files: string[]): Promise<void> {
    try {
      for (const file of files) {
        await execAsync(`git add "${file}"`);
        console.log(`Arquivo adicionado: ${file}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar arquivos:', error);
      throw new Error('Falha ao adicionar arquivos');
    }
  }

  /**
   * Verifica se há mudanças para commitar
   */
  async hasChanges(): Promise<boolean> {
    try {
      const { stdout } = await execAsync('git status --porcelain');
      return stdout.trim().length > 0;
    } catch (error) {
      console.error('Erro ao verificar mudanças:', error);
      return false;
    }
  }

  /**
   * Faz commit das mudanças
   */
  async commit(message?: string): Promise<void> {
    try {
      const commitMsg = message || this.config.commitMessage || 'Update profile stats';
      await execAsync(`git commit -m "${commitMsg}"`);
      console.log(`Commit realizado: ${commitMsg}`);
    } catch (error) {
      console.error('Erro ao fazer commit:', error);
      throw new Error('Falha ao fazer commit');
    }
  }

  /**
   * Faz push das mudanças para o repositório remoto
   */
  async push(branch?: string): Promise<void> {
    try {
      const targetBranch = branch || this.config.branch || 'main';
      await execAsync(`git push origin ${targetBranch}`);
      console.log(`Push realizado para branch: ${targetBranch}`);
    } catch (error) {
      console.error('Erro ao fazer push:', error);
      throw new Error('Falha ao fazer push');
    }
  }

  /**
   * Processo completo: add, commit e push
   */
  async commitAndPush(files: string[], message?: string): Promise<boolean> {
    try {
      // Verificar se há mudanças
      const hasChanges = await this.hasChanges();
      if (!hasChanges) {
        console.log('Nenhuma mudança detectada, pulando commit');
        return false;
      }

      // Adicionar arquivos
      await this.addFiles(files);

      // Fazer commit
      await this.commit(message);

      // Fazer push
      await this.push();

      console.log('Mudanças commitadas e enviadas com sucesso');
      return true;
    } catch (error) {
      console.error('Erro no processo de commit e push:', error);
      throw new Error('Falha no processo de commit e push');
    }
  }

  /**
   * Obtém informações do repositório atual
   */
  async getRepositoryInfo(): Promise<{ owner: string; repo: string; branch: string }> {
    try {
      const { stdout: remoteUrl } = await execAsync('git remote get-url origin');
      const { stdout: currentBranch } = await execAsync('git branch --show-current');

      // Extrair owner e repo da URL
      const urlMatch = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
      if (!urlMatch) {
        throw new Error('Não foi possível extrair informações do repositório');
      }

      return {
        owner: urlMatch[1],
        repo: urlMatch[2],
        branch: currentBranch.trim(),
      };
    } catch (error) {
      console.error('Erro ao obter informações do repositório:', error);
      throw new Error('Falha ao obter informações do repositório');
    }
  }
}
