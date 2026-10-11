export type FolderAction = 'create' | 'delete' | 'rename';

export interface FolderChangeEvent {
  action: FolderAction;
  projectId: string;
  folderPath: string;
  newPath?: string;
}
