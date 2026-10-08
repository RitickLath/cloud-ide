import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './project.dto';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable()
export class ProjectService {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async createProjectV1(createDto: CreateProjectDto) {
    await this.workspaceService.create(createDto.framework);
    return { msg: 'This action adds a new project v1' };
  }
}
