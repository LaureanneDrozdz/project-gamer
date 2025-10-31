import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from 'src/events/event-bus.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ namespace: '/notifications', cors: { origin: true, credentials: true } })
@Injectable()
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  constructor(private eventBus: EventBusService, private jwtService: JwtService) {}

  onGatewayInit() {
    this.logger.log('NotificationGateway initialized');

    // Listen to notification.created events (emitted after DB insert)
    this.eventBus.on('notification.created', (payload: any) => {
      try {
        const userId = payload?.user_id || payload?.userId;
        if (!userId) return;
        this.server.to(`user:${userId}`).emit('notification', payload);
      } catch (err) {
        this.logger.error('Failed to forward notification.created', err as any);
      }
    });

    // Fallback: listen to vote.created so we still push if notification.created is not emitted
    this.eventBus.on('vote.created', (payload: any) => {
      try {
        const owner = payload?.userId;
        if (!owner) return;
        const dto = {
          type: 'LIKE',
          userId: owner,
          actorId: payload.actorId,
          targetType: payload.targetType,
          targetId: payload.targetId,
          created_at: new Date().toISOString(),
        };
        this.server.to(`user:${owner}`).emit('notification', dto);
      } catch (err) {
        this.logger.error('Failed to forward vote.created', err as any);
      }
    });
  }

  // Nest's OnGatewayInit requires `afterInit`; keep existing logic in onGatewayInit
  // and delegate from afterInit so the class satisfies the interface without
  // duplicating the initialization code.
  afterInit(server?: Server) {
    try {
      this.onGatewayInit();
    } catch (err) {
      this.logger.error('Error during afterInit', err as any);
    }
  }

  async handleConnection(client: Socket) {
    try {
      // Prefer token in auth for sockets, fallback to cookie named 'token'
      const token = (client.handshake.auth && client.handshake.auth.token) || this.extractTokenFromCookie(client.handshake.headers.cookie as string | undefined);
      if (!token) {
        this.logger.warn(`Socket ${client.id} missing token, disconnecting`);
        client.disconnect(true);
        return;
      }

      const payload = await this.jwtService.verifyAsync(token as string);
      const userId = (payload as any)?.id as string | undefined;
      if (!userId) {
        this.logger.warn(`Socket ${client.id} invalid token payload, disconnecting`);
        client.disconnect(true);
        return;
      }

      client.join(`user:${userId}`);
      this.logger.log(`Socket ${client.id} joined user:${userId}`);
    } catch (err) {
      this.logger.warn('Socket auth failed, disconnecting', err as any);
      try { client.disconnect(true); } catch {}
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket ${client.id} disconnected`);
  }

  private extractTokenFromCookie(cookie?: string) {
    if (!cookie) return undefined;
    const parts = cookie.split(';').map((p) => p.trim());
    const tokenPart = parts.find((p) => p.startsWith('token='));
    if (!tokenPart) return undefined;
    return decodeURIComponent(tokenPart.split('=')[1]);
  }
}
