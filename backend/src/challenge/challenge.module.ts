import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { ChallengeOwnershipGuard } from './challenge-ownership.guard';
import { AuthentificationModule } from '../authentification/authentification.module';

@Module({
  imports: [AuthentificationModule],
  controllers: [ChallengeController],
  providers: [ChallengeService, ChallengeOwnershipGuard],
})
export class ChallengeModule {}
