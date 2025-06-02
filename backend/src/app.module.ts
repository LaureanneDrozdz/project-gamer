import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ChallengeModule } from './challenge/challenge.module';
import { ParticipationModule } from './participation/participation.module';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [UserModule, ChallengeModule, ParticipationModule, VoteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
