import { Inject, Injectable } from '@nestjs/common';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { execAsync } from '../common/utils/exec.util';
import { Framework } from '../common/types/project.types';
import workspaceConfig from '../config/workspace.config';
import frameworkConfig from '../config/framework.config';
import dirTree from 'directory-tree';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class WorkspaceService {
  constructor(
    @Inject(workspaceConfig.KEY) private workspaceConf: ConfigType<typeof workspaceConfig>,
    @Inject(frameworkConfig.KEY) private frameworkConf: ConfigType<typeof frameworkConfig>,
  ) { }
  
  async getAllProjectIds() {
    const rootPath = process.cwd();
    const projectPath = path.join(rootPath, this.workspaceConf.rootPath);

    const { stdout } = await execAsync(`ls "${projectPath}"`);
    return stdout.split('\n').filter(Boolean);
  }

  async getFileTree(projectId: string) {
    const rootPath = process.cwd();
    const projectPath = path.join(rootPath, this.workspaceConf.rootPath, projectId);
    return dirTree(projectPath);
  }

  async createProject(framework: Framework, name: string) {
    const rootPath = process.cwd();
    const projectPath = path.join(rootPath, this.workspaceConf.rootPath);
    // Sanitize the workspace name to create a valid directory name
    const projectId = name.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
    
    const command = this.frameworkConf[framework];
    if (!command) {
      throw new Error(`Starter command for framework ${framework} is not defined in .env`);
    }

    const { stdout, stderr } = await execAsync(`mkdir -p "${projectPath}/${projectId}" && cd "${projectPath}/${projectId}" && ${command}`);
    if (stderr) console.error(stderr);
    console.log(stdout);
    
    return projectId;
  }

  async createProjectGit(gitUrl: string, name: string) {
    const rootPath = process.cwd();
    const projectPath = path.join(rootPath, this.workspaceConf.rootPath);
    const projectId = name.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
    
    // TODO: To Implement actual git clone logic here.
    const { stdout, stderr } = await execAsync(`mkdir -p "${projectPath}/${projectId}"`);
    if (stderr) console.error(stderr);
    
    return projectId;
  }
}
