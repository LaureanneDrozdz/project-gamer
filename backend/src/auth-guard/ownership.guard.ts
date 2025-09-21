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

     const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token manquant ou mal formaté');
    }
    const token = authHeader.replace('Bearer ', '').trim();
    const decodedToken = this.authService.decodeToken(token)

    const resourceId = request.params.id; 
    if (!resourceId) {
      throw new UnauthorizedException('ID de ressource manquant');
    }
   
    const resource = await this.resourceService.findOne(resourceId);
    if (!resource) {
      throw new UnauthorizedException('Ressource introuvable');
    }
    
    if (resource.user_id !== decodedToken.id && decodedToken.role !== 'ADMIN') {
      throw new ForbiddenException('Accès refusé : vous n’êtes pas le propriétaire');
    }
    

    const isOwner = resource.user_id === user.id;
    const isAdmin = user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Accès interdit');
    }

    return true;
  }
}