import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthentificationService } from '../authentification/authentification.service';

interface ResourceService {
  findOne(id: string | number): Promise<{ user_id?: string | number } | null>;
}

type AuthRequest = Request & {
  cookies?: Record<string, unknown>;
  user?: Record<string, unknown>;
  params?: Record<string, unknown>;
};

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly resourceService: ResourceService,
    private readonly authService: AuthentificationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const token = request.cookies?.token as string || request.cookies?.admin_token as string || undefined;
    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    const decodedToken = this.authService.decodeToken(token);
    console.log('OwnershipGuard: decodedToken', decodedToken);
    const resourceId = request.params?.id;
    console.log('OwnershipGuard: resourceId', resourceId);
    if (!resourceId) {
      throw new UnauthorizedException('ID de ressource manquant');
    }

    const resource = await this.resourceService.findOne(
      resourceId as string | number,
    );
    console.log('OwnershipGuard: resource', resource);
    if (!resource) {
      throw new UnauthorizedException('Ressource introuvable');
    }
    

    const isOwner = resource.user_id === decodedToken.id;
    const isAdmin = decodedToken.role === 'ADMIN';
    console.log('OwnershipGuard:', { isOwner, isAdmin });
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Accès interdit');
    }

    return true;
  }
}
