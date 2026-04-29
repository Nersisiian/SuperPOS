import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  afterInit(server: Server) { console.log('WebSocket Gateway initialized'); }
  handleConnection(client: any) { console.log('Client connected:', client.id); }
  handleDisconnect(client: any) { console.log('Client disconnected:', client.id); }

  broadcastProductUpdate(product: any) { this.server.emit('product.updated', product); }
  broadcastOrderCreated(order: any) { this.server.emit('order.created', order); }
}