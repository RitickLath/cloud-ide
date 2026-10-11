import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { FolderService } from '../folder/folder.service';
import { WorkspaceService } from '../workspace/workspace.service';
import type { FileChangeEvent, FolderChangeEvent } from './watchman.types';

@Injectable()
export class WatchmanService {
  constructor(
    private readonly fileService: FileService,
    private readonly folderService: FolderService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  /**
   * Delegates file operations to FileService.
   */
  async handleFileOperation(payload: FileChangeEvent) {
    return this.fileService.handleAction(payload);
  }

  /**
   * Delegates folder operations to FolderService.
   */
  async handleFolderOperation(payload: FolderChangeEvent) {
    return this.folderService.handleAction(payload);
  }

  /**
   * Fetches the complete file tree for a given project.
   */
  async getFileTree(projectId: string) {
    return this.workspaceService.getFileTree(projectId);
  }
}
