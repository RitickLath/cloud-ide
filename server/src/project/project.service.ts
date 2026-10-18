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
    const projectId = createDto.name
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .toLowerCase();

    // 1. Immediately create workspace in DB with status CREATING
    const workspace = await this.prisma.workspace.create({
      data: {
        name: createDto.name,
        slug: projectId,
        framework: createDto.framework,
        status: 'CREATING',
        ownerId: userId,
        s3Bucket: 'local-bucket',
        s3Prefix: `workspaces/${projectId}`,
        storageBytes: BigInt(0),
      },
    });

    // 2. Queue the scaffolding process in the background
    await this.workspaceService.queueProjectCreation({
      workspaceId: workspace.id,
      projectId,
      framework: createDto.framework,
      name: createDto.name,
      userId,
    });

    // 3. Return instantly
    return {
      msg: 'Project creation initiated',
      projectId,
      workspace: {
        ...workspace,
        storageBytes: Number(workspace.storageBytes),
      },
    };
  }

  async createProjectGit(gitDto: CreateProjectGitDto, userId: string) {
    const projectId = gitDto.name.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();

    // 1. Immediately create workspace in DB with status CREATING
    const workspace = await this.prisma.workspace.create({
      data: {
        name: gitDto.name,
        slug: projectId,
        framework: 'git',
        gitUrl: gitDto.gitUrl,
        status: 'CREATING',
        ownerId: userId,
        s3Bucket: 'local-bucket',
        s3Prefix: `workspaces/${projectId}`,
        storageBytes: BigInt(0),
      },
    });

    // 2. Queue the git clone in the background
    await this.workspaceService.queueProjectGitCreation({
      workspaceId: workspace.id,
      projectId,
      gitUrl: gitDto.gitUrl,
      name: gitDto.name,
      userId,
    });

    // 3. Return instantly
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
