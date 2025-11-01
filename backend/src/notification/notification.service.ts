import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from 'src/events/event-bus.service';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private eventBus: EventBusService,
  ) {}
  private readonly logger = new Logger(NotificationService.name);

  onModuleInit() {
    // listen to vote.created events
    this.eventBus.on('vote.created', (payload: unknown) => {
      void (async () => {
        try {
          const obj = payload as Record<string, unknown>;
          const ownerId = (obj.userId ?? obj.user_id) as string | undefined;
          const actorId = (obj.actorId ?? obj.actor_id) as string | undefined;
          const targetType = (obj.targetType ?? obj.target_type) as
            | string
            | undefined;
          const targetId = (obj.targetId ?? obj.target_id) as
            | string
            | undefined;
          if (!ownerId || !actorId || ownerId === actorId) return;
          const p = this.prisma;
          try {
            const data = {
              user_id: ownerId,
              actor_id: actorId,
              action: 'LIKE' as const,
              ...(targetType ? { target_type: targetType } : {}),
              ...(targetId ? { target_id: targetId } : {}),
            };
            const created = await p.notification.create({
              data: data as unknown as Parameters<
                typeof p.notification.create
              >[0]['data'],
            });
            // emit notification.created for gateway to push
            this.eventBus.emit('notification.created', created);
          } catch (e: unknown) {
            if (typeof e === 'object' && e !== null && 'code' in e) {
              const code = (e as Record<string, unknown>)['code'];
              if (code === 'P2002') {
                this.logger.debug('Duplicate notification ignored');
              } else {
                throw e;
              }
            } else {
              throw e;
            }
          }
        } catch (err: unknown) {
          this.logger.error(
            'Failed to create notification from event',
            err as Error,
          );
        }
      })();
    });
  }

  async getUserNotifications(userId: string, onlyUnread = false) {
    const p = this.prisma;
    return p.notification.findMany({
      where: { user_id: userId, ...(onlyUnread ? { read: false } : {}) },
      orderBy: { created_at: 'desc' },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    // ensure the notification belongs to the user
    const p = this.prisma;
    const existing = await p.notification.findUnique({
      where: { id: notificationId },
    });
    if (!existing || existing.user_id !== userId) {
      throw new Error('Notification not found or access denied');
    }
    const notification = await p.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
    return notification;
  }

  async remove(notificationId: string, userId: string) {
    const p = this.prisma;
    const existing = await p.notification.findUnique({
      where: { id: notificationId },
    });
    if (!existing || existing.user_id !== userId) {
      throw new Error('Notification not found or access denied');
    }
    await p.notification.delete({
      where: { id: notificationId },
    });
    return { message: 'Notification removed' };
  }

  async getUnreadCount(userId: string) {
    const p = this.prisma;
    return p.notification.count({ where: { user_id: userId, read: false } });
  }
}
