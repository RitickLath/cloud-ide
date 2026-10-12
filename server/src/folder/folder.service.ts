import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import fs from 'fs/promises';
import path from 'path';
import workspaceConfig from '../config/workspace.config';
import type { FolderChangeEvent } from './folder.types';

@Injectable()
export class FolderService {
  private readonly logger = new Logger(FolderService.name);

  constructor(
    @Inject(workspaceConfig.KEY)
    private readonly workspaceConf: ConfigType<typeof workspaceConfig>,
  ) {}

  private resolveFolderPath(folderPath: string, projectId?: string): string {
    if (path.isAbsolute(folderPath)) {
      return folderPath;
    }

    const rootPath = process.cwd();
    if (projectId) {
      return path.join(
        rootPath,
        this.workspaceConf.rootPath,
        projectId,
        folderPath,
      );
    }

    return path.join(rootPath, this.workspaceConf.rootPath, folderPath);
  }

  async handleAction(payload: FolderChangeEvent) {
    switch (payload.action) {
      case 'create':
        return this.create(payload);
      case 'delete':
        return this.delete(payload);
      case 'rename':
        return this.rename(payload);
      default:
        throw new Error(
          `Unsupported folder action: ${(payload as any).action}`,
        );
    }
  }

  async create(payload: FolderChangeEvent) {
    try {
      const fullPath = this.resolveFolderPath(
        payload.folderPath,
        payload.projectId,
      );
      await fs.mkdir(fullPath, { recursive: true });
      return { success: true, folderPath: payload.folderPath };
    } catch (error: any) {
      this.logger.error(
        `Failed to create folder: ${payload.folderPath}`,
        error.stack,
      );
      return { success: false, error: error.message };
    }
  }

  async delete(payload: FolderChangeEvent) {
    try {
      const fullPath = this.resolveFolderPath(
        payload.folderPath,
        payload.projectId,
      );
      await fs.rm(fullPath, { recursive: true, force: true });
      return { success: true, folderPath: payload.folderPath };
    } catch (error: any) {
      this.logger.error(
        `Failed to delete folder: ${payload.folderPath}`,
        error.stack,
      );
      return { success: false, error: error.message };
    }
  }

  async rename(payload: FolderChangeEvent) {
    try {
      const fullPath = this.resolveFolderPath(
        payload.folderPath,
        payload.projectId,
      );
      const fullNewPath = this.resolveFolderPath(
        payload.newPath || '',
        payload.projectId,
      );
      await fs.rename(fullPath, fullNewPath);
      return {
        success: true,
        folderPath: payload.folderPath,
        newPath: payload.newPath,
      };
    } catch (error: any) {
      this.logger.error(
        `Failed to rename folder: ${payload.folderPath}`,
        error.stack,
      );
      return { success: false, error: error.message };
    }
  }
}
