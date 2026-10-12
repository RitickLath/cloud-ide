import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3002, {
  cors: { origin: '*' },
  namespace: '/terminal',
})
export class TerminalGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Socket) {
    console.log('Terminal Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected to terminal gateway');
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected from terminal gateway');
  }

  @SubscribeMessage('')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }
}
