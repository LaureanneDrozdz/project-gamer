import { Controller, Get, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { NotificationEntity } from './entities/notification.entity';
import { JwtAuthGuard } from 'src/auth-guard/jwt-auth.guard';
import { Request } from 'express';


@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ description: 'Liste des notifications pour l\'utilisateur authentifié', type: [NotificationEntity] })
  async findAll(@Req() req: Request, @Query('onlyUnread') onlyUnread?: string) {
    const user = req.user as any;
    const userId = user?.id as string;
    const onlyUnreadFlag = onlyUnread === 'true' || onlyUnread === '1';
    return this.notificationService.getUserNotifications(userId, onlyUnreadFlag);
  }

  @Patch(':id/read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: 'ID de la notification à mettre à jour' })
  @ApiResponse({ description: 'Notification mise à jour', type: NotificationEntity })
  update(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    const userId = user?.id as string;
    return this.notificationService.markAsRead(id, userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: 'ID de la notification à supprimer' })
  @ApiResponse({ description: 'Notification supprimée', type: NotificationEntity })
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    const userId = user?.id as string;
    return this.notificationService.remove(id, userId);
  }

}
