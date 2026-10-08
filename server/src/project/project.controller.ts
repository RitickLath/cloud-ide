import { Body, Controller, Get, Param, Post, Version } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post('')
  async createProjectV1(@Body() createDto: CreateProjectDto) {
    return await this.projectService.createProjectV1(createDto);
  }

  @Get(':projectId/file-structure')
  async getFileTree(@Param('projectId') projectId: string) {
    return this.projectService.getFileTree(projectId);
  }
}
