# NestJS WebSockets & Multiplayer Sync Guide

This guide covers the core concepts required to build a real-time, collaborative IDE backend using NestJS and Socket.IO.

---

## Concept 0: Architecture (Namespaces & Services)

In a maintainable NestJS application, WebSockets are divided into two parts: the **Gateway** (the traffic controller) and the **Service** (the business logic).

### 1. The Namespace
By default, all socket connections go to the root url (`/`). For large apps, you should segment traffic using Namespaces.
```typescript
@WebSocketGateway({ 
  namespace: '/workspace', // Clients connect to ws://localhost:3000/workspace
  cors: { origin: '*' }    // Allow your frontend to connect
})
export class WatchmanGateway {}
```

### 2. Dependency Injection
Never put heavy logic (like file writing or DB calls) in the Gateway. Inject a Service to handle it.
```typescript
@WebSocketGateway({ namespace: '/workspace' })
export class WatchmanGateway {
  // Inject the service!
  constructor(private readonly watchmanService: WatchmanService) {}
}
```

---

## Concept 1: The Request-Response Cycle

The most basic WebSocket interaction. A client sends a message, and the server replies directly back to that specific client.

*   **`@SubscribeMessage('event')`**: Listens for a specific action from the client.
*   **`client.emit()`**: Sends a message straight back to the person who asked.

```typescript
@SubscribeMessage('ping')
handlePing(client: Socket, payload: any) {
  // Replies ONLY to the single client who sent the 'ping'
  client.emit('pong', "Hello!"); 
}
```

---

## Concept 2: Rooms & Dynamic Sorting

In a collaborative app, users are grouped by project. You don't want to broadcast Code for Project A to a user looking at Project B. You solve this with **Rooms**.

*   **The single listener**: You only need one `@SubscribeMessage` to handle thousands of rooms.
*   **The dynamic room name**: The client passes the room name (e.g., `projectId`) in the payload.
*   **`client.join(roomName)`**: Socket.IO automatically creates the room in memory if it doesn't exist, and adds the user to it.

```typescript
@SubscribeMessage('join_project')
joinProject(client: Socket, payload: { projectId: string }) {
  // Dynamically puts the user in a room based on the payload they sent!
  client.join(payload.projectId); 
}
```

---

## Concept 3: Broadcasting to Others

When a user types code, you don't need to send that code back to them. You need to send it to their coding partners.

*   **`client.to(roomName).emit()`**: This is the magic multiplayer command. It sends the message to **everyone in the room EXCEPT the sender**.

```typescript
@SubscribeMessage('file_edit')
handleFileEdit(client: Socket, payload: { projectId: string, content: string }) {
  // 1. Save it to disk using your service
  this.watchmanService.saveFile(payload);

  // 2. Broadcast the change to everyone ELSE in the room
  client.to(payload.projectId).emit('sync_file', payload.content);
}
```

---

## Concept 4: Server-Initiated Events (The Global Server)

Sometimes the server needs to push a message without a client asking first. (e.g., a background process like `chokidar` detects a file changed on the hard drive).

To do this, you cannot rely on the `client` object, because no client triggered the event. You must grab the master Socket.IO server instance.

*   **`@WebSocketServer() server: Server;`**: Gives you global access.
*   **`this.server.to(roomName).emit()`**: Broadcasts to **everyone** in the room, including the person who made the change (if applicable).

```typescript
@WebSocketGateway()
export class WatchmanGateway {
  
  @WebSocketServer()
  server: Server; // The master instance

  // A custom method that your Service can call whenever it wants!
  broadcastExternalChange(projectId: string, fileName: string) {
    // Sends to everyone in the project
    this.server.to(projectId).emit('file_changed_on_disk', fileName);
  }
}
```

---

## Concept 5: Clean Code with NestJS Decorators

Instead of using raw `(client: any, payload: any)` arguments, use NestJS decorators for strong typing and cleaner code.

*   **`@ConnectedSocket()`**: Grabs the Socket instance.
*   **`@MessageBody()`**: Extracts the payload cleanly.

```typescript
// BAD:
@SubscribeMessage('typing')
handleTyping(client: any, payload: any) {}

// GOOD:
@SubscribeMessage('typing')
handleTyping(
  @ConnectedSocket() client: Socket, 
  @MessageBody() projectId: string
) {
  client.to(projectId).emit('partner_is_typing');
}
```
