import { Body, Controller, Post, Version } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Version('1')
  @Post('')
  async createProjectV1(@Body() createDto: CreateProjectDto) {
    const project = await this.projectService.createProjectV1(createDto);
    return project;
  }
}
