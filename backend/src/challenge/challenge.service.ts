import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { ChallengeEntity } from './entities/challenge.entity';

@Injectable()
export class ChallengeService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(ChallengeService.name);

  async create(createChallengeDto: CreateChallengeDto) {
    try {
      const { user_id, image_url, ...rest } = createChallengeDto;
      const finalImageUrl =
        image_url?.trim() ||
        `https://via.assets.so/game.webp?id=${Math.floor(Math.random() * 50) + 1}`;
      const challenge = await this.prisma.challenge.create({
        data: {
          ...rest,
          image_url: finalImageUrl,
          creator: {
            connect: {
              id: user_id,
            },
          },
        },
      });
      return new ChallengeEntity(challenge);
    } catch (error) {
      this.logger.error('Error creating challenge', error);
      throw new BadRequestException('invalid data');
    }
  }

  async findAll() {
    const res = await this.prisma.challenge.findMany({
      include: {
        votes: true,
        participations: {
          select: {
            votes: true,
          },
        },
      },
    });
    return res.map((challenge) => new ChallengeEntity(challenge));
  }

  async findOne(id: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },

      include: {
        votes: true,
        participations:{
          select: {
            votes: true,
          },  
        },
        creator: {
          select: {
            userName: true,
          },
        },
      },
    });
    if (!challenge) {
      return null;
    }

    return new ChallengeEntity(challenge);
  }

  async update(id: string, updateChallengeDto: UpdateChallengeDto) {
    try {
      const challenge = await this.prisma.challenge.update({
        where: { id },
        data: updateChallengeDto,
      });
      return new ChallengeEntity(challenge);
    } catch (error) {
      this.logger.error('Error updating challenge', error);
      throw new BadRequestException('invalid data');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.challenge.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error('Error removing challenge', error);
      throw new BadRequestException('invalid data');
    }
  }

  async validateChallenge(id: string, validated: boolean) {
    try {
      const challenge = await this.prisma.challenge.update({
        where: { id },
        data: { validated },
      });
      return new ChallengeEntity(challenge);
    } catch (error) {
      this.logger.error('Error validating challenge', error);
      throw new BadRequestException('invalid data');
    }
  }
}
