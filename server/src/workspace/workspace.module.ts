import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkspaceService } from './workspace.service';
import workspaceConfig from '../config/workspace.config';
import frameworkConfig from '../config/framework.config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../prisma/prisma.module';
import { WatchmanModule } from '../watchman/watchman.module';
import { WorkspaceProcessor } from './workspace.processor';

@Module({
  imports: [
    ConfigModule.forFeature(workspaceConfig),
    ConfigModule.forFeature(frameworkConfig),
    PrismaModule,
    forwardRef(() => WatchmanModule),
    BullModule.registerQueue({
      name: 'workspace-queue',
    }),
  ],
  providers: [WorkspaceService, WorkspaceProcessor],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
