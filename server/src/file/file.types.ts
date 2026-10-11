export type FileAction =
  'create' | 'edit' | 'save' | 'delete' | 'rename' | 'move' | 'read';

export interface FileChangeEvent {
  action: FileAction;
  projectId: string;
  filePath: string;
  content?: string;
  newPath?: string;
}
