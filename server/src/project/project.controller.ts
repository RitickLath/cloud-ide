import { Body, Controller, Get, Param, Post, Version } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, CreateProjectGitDto } from './project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post('')
  async createProjectV1(@Body() createDto: CreateProjectDto) {
    return await this.projectService.createProjectV1(createDto);
  }

  @Post('git')
  async createProjectGit(@Body() gitDto: CreateProjectGitDto) {
    return await this.projectService.createProjectGit(gitDto);
  }

  @Get(':projectId/tree')
  async getFileTree(@Param('projectId') projectId: string) {
    return this.projectService.getFileTree(projectId);
  }
}
