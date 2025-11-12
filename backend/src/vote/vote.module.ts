import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { VoteOwnershipGuard } from './vote-ownership.guard';
import { AuthentificationModule } from 'src/authentification/authentification.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [AuthentificationModule, NotificationModule],
  controllers: [VoteController],
  providers: [VoteService, VoteOwnershipGuard],
})
export class VoteModule {}
