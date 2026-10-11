export * from '../file/file.types';
export * from '../folder/folder.types';

/**
 * Room and session payloads.
 */
export interface JoinProjectPayload {
  projectId: string;
  userId?: string;
  userName?: string;
}

export interface LeaveProjectPayload {
  projectId: string;
  userId?: string;
}

export interface FileTreePayload {
  projectId: string;
}
