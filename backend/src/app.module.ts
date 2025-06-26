import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ChallengeModule } from './challenge/challenge.module';
import { ParticipationModule } from './participation/participation.module';
import { VoteModule } from './vote/vote.module';
import { MinioModule } from './minio/minio.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthentificationModule } from './authentification/authentification.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, // now available globally
    UserModule, 
    ChallengeModule, 
    ParticipationModule, 
    VoteModule,
    MinioModule, 
    AuthentificationModule, 
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}