import {CanActivate,ExecutionContext,Injectable, UnauthorizedException,ForbiddenException,} from '@nestjs/common';
import { AuthentificationService } from '../authentification/authentification.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly resourceService: any, 
    private readonly authService: AuthentificationService,
  ) {}


  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const token = request.cookies?.token;
    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }
    const decodedToken = this.authService.decodeToken(token)

    const resourceId = request.params.id; 
    if (!resourceId) {
      throw new UnauthorizedException('ID de ressource manquant');
    }
   
    const resource = await this.resourceService.findOne(resourceId);
    if (!resource) {
      throw new UnauthorizedException('Ressource introuvable');
    }
    
    const isOwner = resource.user_id === decodedToken.id;
    const isAdmin = decodedToken.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Accès interdit');
    }

    return true;
  }
}