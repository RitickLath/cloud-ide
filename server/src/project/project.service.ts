import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto, CreateProjectGitDto } from './project.dto';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly workspaceService: WorkspaceService,
  ) { }

  async createProjectV1(createDto: CreateProjectDto) {
    const projectId = await this.workspaceService.createProject(createDto.framework, createDto.name);
    return { msg: 'This action adds a new project v1', projectId };
  }

  async createProjectGit(gitDto: CreateProjectGitDto) {
    const projectId = await this.workspaceService.createProjectGit(gitDto.gitUrl, gitDto.name);
    return { msg: 'Git import initiated', projectId };
  }

  async getFileTree(projectId: string) {
    const projects = await this.workspaceService.getAllProjectIds();
    
    if (!projects?.includes(projectId)) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return this.workspaceService.getFileTree(projectId);
  }
}
