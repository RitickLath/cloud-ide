import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FolderService } from './folder.service';
import workspaceConfig from '../config/workspace.config';

@Module({
  imports: [ConfigModule.forFeature(workspaceConfig)],
  providers: [FolderService],
  exports: [FolderService],
})
export class FolderModule {}
