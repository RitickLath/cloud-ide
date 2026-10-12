import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import fs from 'fs/promises';
import path from 'path';
import workspaceConfig from '../config/workspace.config';
import type { FileChangeEvent } from './file.types';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    @Inject(workspaceConfig.KEY)
    private readonly workspaceConf: ConfigType<typeof workspaceConfig>,
  ) {}

  /**
   * Helper to resolve the absolute path of a file safely.
   */
  private resolveFilePath(filePath: string, projectId?: string): string {
    // If the path is already absolute, use it directly
    if (path.isAbsolute(filePath)) {
      return filePath;
    }

    const rootPath = process.cwd();
    if (projectId) {
      return path.join(
        rootPath,
        this.workspaceConf.rootPath,
        projectId,
        filePath,
      );
    }

    return path.join(rootPath, this.workspaceConf.rootPath, filePath);
  }

  async handleAction(payload: FileChangeEvent) {
    switch (payload.action) {
      case 'create':
        return this.create(payload);
      case 'edit':
        return this.edit(payload);
      case 'save':
        return this.save(payload);
      case 'delete':
        return this.delete(payload);
      case 'rename':
        return this.rename(payload);
      case 'move':
        return this.move(payload);
      case 'read':
        return this.read(payload);
      default:
        throw new Error(`Unsupported file action: ${(payload as any).action}`);
    }
  }

  async create(payload: FileChangeEvent) {
    try {
      const fullPath = this.resolveFilePath(
        payload.filePath,
        payload.projectId,
      );
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, payload.content || '');
      return { success: true, filePath: payload.filePath };
    } catch (error: any) {
      this.logger.error(
        `Failed to create file: ${payload.filePath}`,
        error.stack,
      );
      return { success: false, error: error.message };
    }
  }

  async edit(payload: FileChangeEvent) {
    try {
      const fullPath = this.resolveFilePath(
        payload.filePath,
        payload.projectId,
      );
      const content = await fs.writeFile(fullPath, payload.content || '');

      return { success: true, content, filePath: payload.filePath };
    } catch (error: any) {
      this.logger.error(
        `Failed to read file: ${payload.filePath}`,
        error.stack,
      );
      return { success: false, content: '', error: error.message };
    }
  }

  async save(payload: FileChangeEvent) {
    // TODO: Implement persisting file buffer to disk
    return { success: true, message: 'File saved' };
  }

  async delete(payload: FileChangeEvent) {
    try {
      const fullPath = this.resolveFilePath(
        payload.filePath,
        payload.projectId,
      );
      await fs.unlink(fullPath);
      return { success: true, filePath: payload.filePath };
    } catch (error: any) {
      this.logger.error(
        `Failed to delete file: ${payload.filePath}`,
        error.stack,
      );
      return { success: false, content: '', error: error.message };
    }
  }

  async rename(payload: FileChangeEvent) {
    try {
      const fullPath = this.resolveFilePath(
        payload.filePath,
        payload.projectId,
      );
      const fullNewPath = this.resolveFilePath(
        payload.newPath || '',
        payload.projectId,
      );
      await fs.rename(fullPath, fullNewPath);
      return {
        success: true,
        filePath: payload.filePath,
        newPath: payload.newPath,
      };
    } catch (error: any) {
      this.logger.error(
        `Failed to rename file: ${payload.filePath}`,
        error.stack,
      );
      return { success: false, error: error.message };
    }
  }

  async move(payload: FileChangeEvent) {
    try {
      const fullPath = this.resolveFilePath(
        payload.filePath,
        payload.projectId,
      );
      const fullNewPath = this.resolveFilePath(
        payload.newPath || '',
        payload.projectId,
      );
      await fs.rename(fullPath, fullNewPath);
      return {
        success: true,
        filePath: payload.filePath,
        newPath: payload.newPath,
      };
    } catch (error: any) {
      this.logger.error(
        `Failed to move file: ${payload.filePath}`,
        error.stack,
      );
      return { success: false, error: error.message };
    }
  }

  async read(payload: FileChangeEvent) {
    try {
      const fullPath = this.resolveFilePath(
        payload.filePath,
        payload.projectId,
      );
      const content = await fs.readFile(fullPath, 'utf-8');
      return { success: true, content, filePath: payload.filePath };
    } catch (error: any) {
      this.logger.error(
        `Failed to read file: ${payload.filePath}`,
        error.stack,
      );
      return { success: false, content: '', error: error.message };
    }
  }
}
