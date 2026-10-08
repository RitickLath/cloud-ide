import { Module } from '@nestjs/common';
import { ProjectModule } from '../project/project.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [
    ProjectModule,
    WorkspaceModule
  ]
})
export class DomainModule { }
