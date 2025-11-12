import { Module } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { UserModule } from '../user/user.module';
import { AuthentificationController } from './authentification.controller';

@Module({
  imports: [UserModule],
  providers: [AuthentificationService],
  controllers: [AuthentificationController],
  exports: [AuthentificationService],
})
export class AuthentificationModule {}
