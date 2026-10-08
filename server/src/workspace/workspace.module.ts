import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkspaceService } from './workspace.service';
import workspaceConfig from '../config/workspace.config';
import frameworkConfig from '../config/framework.config';

@Module({
  imports: [
    ConfigModule.forFeature(workspaceConfig),
    ConfigModule.forFeature(frameworkConfig),
  ],
  providers: [WorkspaceService],
  exports: [WorkspaceService]
})
export class WorkspaceModule { }
