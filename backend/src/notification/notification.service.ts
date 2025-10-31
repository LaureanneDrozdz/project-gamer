import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from 'src/events/event-bus.service';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(private prisma: PrismaService, private eventBus: EventBusService) {}
  private readonly logger = new Logger(NotificationService.name);
    
  onModuleInit() {
    // listen to vote.created events
    this.eventBus.on('vote.created', async (payload: any) => {
      try {
        const { userId: ownerId, actorId, targetType, targetId } = payload;
        if (!ownerId || ownerId === actorId) return;
        const p: any = this.prisma as any;
        try {
          const created = await p.notification.create({
            data: {
              user_id: ownerId,
              actor_id: actorId,
              action: 'LIKE',
              target_type: targetType,
              target_id: targetId,
            },
          });
          // emit notification.created for gateway to push
          this.eventBus.emit('notification.created', created);
        } catch (e: any) {
          if (e?.code === 'P2002') {
            this.logger.debug('Duplicate notification ignored');
          } else {
            throw e;
          }
        }
      } catch (err) {
        // swallow errors - logging could be added
        this.logger.error('Failed to create notification from event', err as any);
      }
    });
  }

  async getUserNotifications(userId: string, onlyUnread = false) {
    const p: any = this.prisma as any;
    return p.notification.findMany({
      where: { user_id: userId, ...(onlyUnread ? { read: false } : {}) },
      orderBy: { created_at: 'desc' },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    // ensure the notification belongs to the user
  const p: any = this.prisma as any;
  const existing = await p.notification.findUnique({ where: { id: notificationId } });
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
  const p: any = this.prisma as any;
  const existing = await p.notification.findUnique({ where: { id: notificationId } });
    if (!existing || existing.user_id !== userId) {
      throw new Error('Notification not found or access denied');
    }
    await p.notification.delete({
      where: { id: notificationId },
    });
    return { message: 'Notification removed' };
  }

  async getUnreadCount(userId: string) {
    const p: any = this.prisma as any;
    return p.notification.count({ where: { user_id: userId, read: false } });
  }

}
