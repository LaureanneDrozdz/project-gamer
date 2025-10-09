import { OwnershipGuard } from './ownership.guard';
import { AuthentificationService } from '../authentification/authentification.service';

describe('OwnershipGuard', () => {
  let resourceService: any;
  let authService: Partial<AuthentificationService>;
  let guard: OwnershipGuard;

  beforeEach(() => {
    resourceService = {
      findOne: jest.fn(),
    };

    authService = {
      decodeToken: jest.fn(),
    };

    guard = new OwnershipGuard(
      resourceService,
      authService as AuthentificationService,
    );
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
