import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { WorkspaceService } from './workspace.service';
import { PrismaService } from '../prisma/prisma.service';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { WatchmanGateway } from '../watchman/watchman.gateway';

@Processor('workspace-queue')
export class WorkspaceProcessor extends WorkerHost {
  private readonly logger = new Logger(WorkspaceProcessor.name);

  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => WatchmanGateway))
    private readonly watchmanGateway: WatchmanGateway,
  ) {
    super();
  }

  async process(job: Job) {
    this.logger.log(`Processing job ${job.name} (id: ${job.id})`);

    if (job.name === 'create-project-v1') {
      const { workspaceId, framework, name, userId } = job.data;
      try {
        const projectId = await this.workspaceService.createProject(
          framework,
          name,
        );
        const storageBytes =
          await this.workspaceService.calculateWorkspaceSize(projectId);

        const updatedWorkspace = await this.prisma.workspace.update({
          where: { id: workspaceId },
          data: {
            status: 'READY',
            storageBytes,
          },
        });

        this.logger.log(`Project ${projectId} created and READY.`);

        // Broadcast to user / workspace channel that creation finished
        this.watchmanGateway.server.emit('workspace-ready', {
          workspaceId,
          projectId,
          userId,
          status: 'READY',
          workspace: {
            ...updatedWorkspace,
            storageBytes: Number(updatedWorkspace.storageBytes),
          },
        });
      } catch (err: any) {
        this.logger.error(
          `Failed to create project v1: ${err.message}`,
          err.stack,
        );
        await this.prisma.workspace.update({
          where: { id: workspaceId },
          data: {
            status: 'ERROR',
          },
        });

        this.watchmanGateway.server.emit('workspace-error', {
          workspaceId,
          userId,
          error: err.message,
        });
        throw err;
      }
    }

    if (job.name === 'create-project-git') {
      const { workspaceId, gitUrl, name, userId } = job.data;
      try {
        const projectId = await this.workspaceService.createProjectGit(
          gitUrl,
          name,
        );
        const storageBytes =
          await this.workspaceService.calculateWorkspaceSize(projectId);

        const updatedWorkspace = await this.prisma.workspace.update({
          where: { id: workspaceId },
          data: {
            status: 'READY',
            storageBytes,
          },
        });

        this.logger.log(`Git project ${projectId} cloned and READY.`);

        // Broadcast to user / workspace channel that creation finished
        this.watchmanGateway.server.emit('workspace-ready', {
          workspaceId,
          projectId,
          userId,
          status: 'READY',
          workspace: {
            ...updatedWorkspace,
            storageBytes: Number(updatedWorkspace.storageBytes),
          },
        });
      } catch (err: any) {
        this.logger.error(
          `Failed to clone git project: ${err.message}`,
          err.stack,
        );
        await this.prisma.workspace.update({
          where: { id: workspaceId },
          data: {
            status: 'ERROR',
          },
        });

        this.watchmanGateway.server.emit('workspace-error', {
          workspaceId,
          userId,
          error: err.message,
        });
        throw err;
      }
    }
  }
}
