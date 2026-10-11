import { Injectable } from '@nestjs/common';
import type { FolderChangeEvent } from './folder.types';

@Injectable()
export class FolderService {
  constructor() {}

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
    // TODO: Implement folder creation on disk (e.g. mkdir -p)
    return { success: true, message: 'Folder created' };
  }

  async delete(payload: FolderChangeEvent) {
    // TODO: Implement recursive folder deletion on disk (e.g. rm -rf)
    return { success: true, message: 'Folder deleted' };
  }

  async rename(payload: FolderChangeEvent) {
    // TODO: Implement folder renaming on disk
    return { success: true, message: 'Folder renamed' };
  }
}
