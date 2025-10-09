import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('JwtAuthGuard', () => {
  let jwtService: JwtService;
  let guard: JwtAuthGuard;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    } as any;

    guard = new JwtAuthGuard(jwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
