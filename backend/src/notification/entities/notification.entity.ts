import { ApiProperty } from '@nestjs/swagger';

export class NotificationEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'user-id-that-receives' })
  user_id: string;

  @ApiProperty({ example: 'actor-id-that-did-action' })
  actor_id: string;

  @ApiProperty({ example: 'LIKE' })
  action: string;

  @ApiProperty({ example: 'CHALLENGE' })
  target_type: string;

  @ApiProperty({ example: 'target-id' })
  target_id: string;

  @ApiProperty({ example: false })
  read: boolean;

  @ApiProperty()
  created_at: string;

  constructor(notification: Partial<NotificationEntity>) {
    Object.assign(this, notification || {});
    // normalize created_at
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.created_at = notification?.created_at instanceof Date
      ? notification.created_at.toISOString()
      : (notification?.created_at as unknown as string);
  }
}
