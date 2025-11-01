import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from 'src/events/event-bus.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: '/notifications',
  cors: { origin: true, credentials: true },
})
@Injectable()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  constructor(
    private eventBus: EventBusService,
    private jwtService: JwtService,
  ) {}

  onGatewayInit() {
    this.logger.log('NotificationGateway initialized');

    // small helper to safely read properties from unknown payloads
    const getProp = (obj: unknown, key: string): unknown => {
      if (typeof obj === 'object' && obj !== null)
        return (obj as Record<string, unknown>)[key];
      return undefined;
    };

    // Listen to notification.created events (emitted after DB insert)
    this.eventBus.on('notification.created', (payload: unknown) => {
      try {
        const userId = (getProp(payload, 'user_id') ??
          getProp(payload, 'userId')) as string | undefined;
        if (!userId) return;
        this.server
          .to(`user:${userId}`)
          .emit('notification', payload as Record<string, unknown>);
      } catch (err: unknown) {
        this.logger.error(
          'Failed to forward notification.created',
          err as Error,
        );
      }
    });

    // Fallback: listen to vote.created so we still push if notification.created is not emitted
    this.eventBus.on('vote.created', (payload: unknown) => {
      try {
        const owner = getProp(payload, 'userId') as string | undefined;
        if (!owner) return;
        const dto = {
          type: 'LIKE',
          userId: owner,
          actorId: getProp(payload, 'actorId') as string | undefined,
          targetType: getProp(payload, 'targetType') as string | undefined,
          targetId: getProp(payload, 'targetId') as string | undefined,
          created_at: new Date().toISOString(),
        };
        this.server
          .to(`user:${owner}`)
          .emit('notification', dto as unknown as Record<string, unknown>);
      } catch (err: unknown) {
        this.logger.error('Failed to forward vote.created', err as Error);
      }
    });
  }

  // Nest's OnGatewayInit requires `afterInit`; keep existing logic in onGatewayInit
  // and delegate from afterInit so the class satisfies the interface without
  // duplicating the initialization code.
  afterInit(_server?: Server) {
    void _server;
    try {
      this.onGatewayInit();
    } catch (err) {
      this.logger.error('Error during afterInit', err);
    }
  }

  async handleConnection(client: Socket) {
    try {
      // Prefer token in auth for sockets, fallback to cookie named 'token'
      const authObj =
        typeof client.handshake.auth === 'object' &&
        client.handshake.auth !== null
          ? (client.handshake.auth as Record<string, unknown>)
          : undefined;
      const authToken =
        authObj && 'token' in authObj
          ? (authObj.token as string | undefined)
          : undefined;
      const token =
        authToken ||
        this.extractTokenFromCookie(client.handshake.headers.cookie);
      if (!token) {
        this.logger.warn(`Socket ${client.id} missing token, disconnecting`);
        client.disconnect(true);
        return;
      }
      const payload = (await this.jwtService.verifyAsync(token)) as
        | { id?: string }
        | undefined;
      const userId = payload?.id;
      if (!userId) {
        this.logger.warn(
          `Socket ${client.id} invalid token payload, disconnecting`,
        );
        client.disconnect(true);
        return;
      }

      client.join(`user:${userId}`);
      this.logger.log(`Socket ${client.id} joined user:${userId}`);
    } catch (err: unknown) {
      this.logger.warn('Socket auth failed, disconnecting', err as Error);
      try {
        client.disconnect(true);
      } catch (disconnectErr: unknown) {
        this.logger.debug(
          'Failed to disconnect client',
          disconnectErr as Error,
        );
      }
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
