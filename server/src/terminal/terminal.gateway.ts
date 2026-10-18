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
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/terminal',
})
export class TerminalGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Terminal Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected to terminal gateway:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected from terminal gateway:', client.id);
  }

  @SubscribeMessage('terminal:input')
  handleTerminalInput(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { projectId: string; data: string },
  ) {
    client.emit('data', payload.data);
  }
}
