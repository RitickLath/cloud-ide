import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ProjectService } from './project.service';
import { CreateProjectDto, CreateProjectGitDto } from './project.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('')
  async createProjectV1(
    @Body() createDto: CreateProjectDto,
    @Req() req: Request,
  ) {
    const userId = req['user']?.sub;
    return await this.projectService.createProjectV1(createDto, userId);
  }

  @Post('git')
  async createProjectGit(
    @Body() gitDto: CreateProjectGitDto,
    @Req() req: Request,
  ) {
    const userId = req['user']?.sub;
    return await this.projectService.createProjectGit(gitDto, userId);
  }

  @Get(':projectId/tree')
  async getFileTree(@Param('projectId') projectId: string) {
    return this.projectService.getFileTree(projectId);
  }

  @Get('')
  async getAllProjects(@Req() req: Request) {
    const userId = req['user']?.sub;
    return await this.projectService.getAllProjects(userId);
  }
}
