import { forwardRef, Module } from '@nestjs/common';
import { WatchmanService } from './watchman.service';
import { WatchmanGateway } from './watchman.gateway';
import { FileModule } from '../file/file.module';
import { FolderModule } from '../folder/folder.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [FileModule, FolderModule, forwardRef(() => WorkspaceModule)],
  providers: [WatchmanService, WatchmanGateway],
  exports: [WatchmanService, WatchmanGateway],
})
export class WatchmanModule {}
