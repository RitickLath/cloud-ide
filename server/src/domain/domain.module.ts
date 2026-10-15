import { Module } from '@nestjs/common';
import { ProjectModule } from '../project/project.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { WatchmanModule } from '../watchman/watchman.module';
import { FileModule } from '../file/file.module';
import { FolderModule } from '../folder/folder.module';
import { TerminalModule } from '../terminal/terminal.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ProjectModule,
    WorkspaceModule,
    WatchmanModule,
    FileModule,
    FolderModule,
    TerminalModule,
    AuthModule,
    UserModule,
  ],
})
export class DomainModule {}
