import { Inject, Injectable } from '@nestjs/common';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { execAsync } from '../common/utils/exec.util';
import { Framework } from '../common/types/project.types';
import workspaceConfig from '../config/workspace.config';
import frameworkConfig from '../config/framework.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class WorkspaceService {
  constructor(
    @Inject(workspaceConfig.KEY) private workspaceConf: ConfigType<typeof workspaceConfig>,
    @Inject(frameworkConfig.KEY) private frameworkConf: ConfigType<typeof frameworkConfig>,
  ) {}

  async create(framework: Framework) {
    try {
      const rootPath = process.cwd();
      const projectPath = path.join(rootPath, this.workspaceConf.rootPath);
      const newProjectRootFolder = uuidv4()
      // Fetch the specific command from the injected framework config
      const command = this.frameworkConf[framework];
      
      if (!command) {
        throw new Error(`Starter command for framework ${framework} is not defined in .env`);
      }

      // Execute the command in the newly created project folder
      const { stdout, stderr } = await execAsync(`cd "${projectPath}" && mkdir ${newProjectRootFolder} && cd ${newProjectRootFolder} && ${command}`);
      if (stderr) {
        console.log(stderr)
      }
      console.log(stdout)
    }
    catch (error) {
      console.log(error);
    }
  }
}
