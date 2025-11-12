import { Module } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { ParticipationController } from './participation.controller';
import { ParticipationOwnershipGuard } from './participation-ownership.guard';
import { AuthentificationModule } from 'src/authentification/authentification.module';

@Module({
  imports: [AuthentificationModule],
  controllers: [ParticipationController],
  providers: [ParticipationService, ParticipationOwnershipGuard],
})
export class ParticipationModule {}
