import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WatchmanService } from './watchman.service';
import type {
  FileChangeEvent,
  FileTreePayload,
  FolderChangeEvent,
  JoinProjectPayload,
  LeaveProjectPayload,
} from './watchman.types';

export type * from './watchman.types';

@WebSocketGateway(3002, {
  cors: { origin: '*' },
  namespace: '/workspace',
})
export class WatchmanGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WatchmanGateway.name);

  @WebSocketServer()
  server: Server; // For broadcasting to clients

  constructor(private readonly watchmanService: WatchmanService) {}

  // GATEWAY LIFECYCLE HOOKS

  afterInit(server: Server) {
    this.logger.log(
      'Watchman WebSocket Gateway initialized on port 3002 (/workspace)',
    );
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // ROOM & SESSION MANAGEMENT

  @SubscribeMessage('join-project')
  async handleJoinProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinProjectPayload,
  ) {
    await client.join(payload.projectId);

    // Acknowledge the joining client
    client.emit('project-joined', {
      message: `Successfully joined project: ${payload.projectId}`,
      projectId: payload.projectId,
    });

    // Notify other peers in the room
    client.to(payload.projectId).emit('user-joined', {
      socketId: client.id,
      userId: payload.userId,
      userName: payload.userName,
    });
  }

  @SubscribeMessage('leave-project')
  async handleLeaveProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: LeaveProjectPayload,
  ) {
    await client.leave(payload.projectId);

    client.emit('project-left', {
      message: `Left project: ${payload.projectId}`,
      projectId: payload.projectId,
    });

    client.to(payload.projectId).emit('user-left', {
      socketId: client.id,
      userId: payload.userId,
    });
  }

  @SubscribeMessage('file-change')
  async handleFileChange(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: FileChangeEvent,
  ) {
    const result = await this.watchmanService.handleFileOperation(payload);

    if (payload.projectId) {
      if (payload.action === 'edit' || payload.action === 'save') {
        // Keystroke edits are only sent to peers to prevent echoing to active typist
        client.to(payload.projectId).emit('file-change', payload);
      } else if (payload.action !== 'read') {
        // Structural mutations (create, delete, rename, move) must reach EVERYONE in the project room
        this.server.to(payload.projectId).emit('file-change', payload);
      }
    }

    return result;
  }

  @SubscribeMessage('folder-change')
  async handleFolderChange(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: FolderChangeEvent,
  ) {
    const result = await this.watchmanService.handleFolderOperation(payload);

    if (payload.projectId) {
      this.server.to(payload.projectId).emit('folder-change', payload);
    }

    return result;
  }

  @SubscribeMessage('get-file-tree')
  async handleGetFileTree(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: FileTreePayload,
  ) {
    const tree = await this.watchmanService.getFileTree(payload.projectId);

    client.emit('file-tree-data', {
      projectId: payload.projectId,
      tree,
    });
  }

  @SubscribeMessage('refresh-file-tree')
  async handleRefreshFileTree(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: FileTreePayload,
  ) {
    const tree = await this.watchmanService.getFileTree(payload.projectId);

    this.server.to(payload.projectId).emit('file-tree-refreshed', {
      projectId: payload.projectId,
      tree,
    });
  }

  // Helper method for background tasks / watchers to push disk changes to a project room.
  broadcastExternalDiskChange(projectId: string, event: string, path: string) {
    this.server.to(projectId).emit('disk-change', { event, path });
  }
}
