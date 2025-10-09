import { Injectable } from '@nestjs/common';
import { OwnershipGuard } from '../auth-guard/ownership.guard';
import { ChallengeService } from './challenge.service';
import { AuthentificationService } from '../authentification/authentification.service';

@Injectable()
export class ChallengeOwnershipGuard extends OwnershipGuard {
  constructor(
    challengeService: ChallengeService,
    authService: AuthentificationService,
  ) {
    super(challengeService, authService);
  }
}
