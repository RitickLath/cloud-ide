import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto, CreateProjectGitDto } from './project.dto';
import { WorkspaceService } from '../workspace/workspace.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly prisma: PrismaService,
  ) {}

  async createProjectV1(createDto: CreateProjectDto, userId: string) {
    const projectId = await this.workspaceService.createProject(
      createDto.framework,
      createDto.name,
    );

    // Calculate storage size excluding node_modules, .git, venv
    const storageBytes =
      await this.workspaceService.calculateWorkspaceSize(projectId);

    // Save workspace in database associated with the logged-in user
    const workspace = await this.prisma.workspace.create({
      data: {
        name: createDto.name,
        slug: projectId,
        framework: createDto.framework,
        status: 'READY',
        ownerId: userId,
        s3Bucket: 'local-bucket',
        s3Prefix: `workspaces/${projectId}`,
        storageBytes,
      },
    });

    return {
      msg: 'This action adds a new project v1',
      projectId,
      workspace: {
        ...workspace,
        storageBytes: Number(workspace.storageBytes),
      },
    };
  }

  async createProjectGit(gitDto: CreateProjectGitDto, userId: string) {
    const projectId = await this.workspaceService.createProjectGit(
      gitDto.gitUrl,
      gitDto.name,
    );

    // Calculate storage size excluding node_modules, .git, venv
    const storageBytes =
      await this.workspaceService.calculateWorkspaceSize(projectId);

    // Save git workspace in database associated with the logged-in user
    const workspace = await this.prisma.workspace.create({
      data: {
        name: gitDto.name,
        slug: projectId,
        framework: 'git',
        gitUrl: gitDto.gitUrl,
        status: 'READY',
        ownerId: userId,
        s3Bucket: 'local-bucket',
        s3Prefix: `workspaces/${projectId}`,
        storageBytes,
      },
    });

    return {
      msg: 'Git import initiated',
      projectId,
      workspace: {
        ...workspace,
        storageBytes: Number(workspace.storageBytes),
      },
    };
  }

  async getFileTree(projectId: string) {
    const projects = await this.workspaceService.getAllProjectIds();

    if (!projects?.includes(projectId)) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return this.workspaceService.getFileTree(projectId);
  }

  async getAllProjects(userId: string) {
    // Return all workspaces belonging to the authenticated user
    return this.prisma.workspace.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
