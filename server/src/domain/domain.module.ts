import { Module } from '@nestjs/common';
import { ProjectModule } from '../project/project.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { WatchmanModule } from '../watchman/watchman.module';
import { FileModule } from '../file/file.module';
import { FolderModule } from '../folder/folder.module';

@Module({
  imports: [
    ProjectModule,
    WorkspaceModule,
    WatchmanModule,
    FileModule,
    FolderModule,
  ],
})
export class DomainModule {}
