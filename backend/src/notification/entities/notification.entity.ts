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
  created_at: Date;

  constructor(notification: Partial<NotificationEntity>) {
    Object.assign(this, notification || {});
  }
}
