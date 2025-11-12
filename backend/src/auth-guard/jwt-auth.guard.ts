import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'types';

type AuthRequest = Request & {
  cookies?: Record<string, unknown>;
  user?: Record<string, unknown>;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const cookies = request.cookies as Record<string, unknown> | undefined;
    const token =
      typeof cookies?.token === 'string' ? cookies.token : typeof cookies?.admin_token === 'string' ? cookies.admin_token : undefined;
    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.user = payload as Record<string, unknown>;
      return true;
    } catch {
      throw new UnauthorizedException('Token invalide');
    }
  }
}
