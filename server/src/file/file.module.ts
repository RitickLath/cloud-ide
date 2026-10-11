import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileService } from './file.service';
import workspaceConfig from '../config/workspace.config';

@Module({
  imports: [ConfigModule.forFeature(workspaceConfig)],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
