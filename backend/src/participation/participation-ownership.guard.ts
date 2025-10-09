import { Injectable } from '@nestjs/common';
import { OwnershipGuard } from '../auth-guard/ownership.guard';
import { ParticipationService } from './participation.service';
import { AuthentificationService } from '../authentification/authentification.service';

@Injectable()
export class ParticipationOwnershipGuard extends OwnershipGuard {
  constructor(
    participationService: ParticipationService,
    authService: AuthentificationService,
  ) {
    super(participationService, authService);
  }
}
