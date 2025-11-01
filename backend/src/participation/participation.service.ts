import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { ParticipationEntity } from './entities/participation.entity';

@Injectable()
export class ParticipationService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(ParticipationService.name);
  async create(createParticipationDto: CreateParticipationDto) {
    const { user_id, challenge_id, ...rest } = createParticipationDto;

    if (!user_id) {
      throw new BadRequestException('user_id est obligatoire');
    }
    if (!challenge_id) {
      throw new BadRequestException('challenge_id est obligatoire');
    }

    try {
      const participation = await this.prisma.participation.create({
        data: {
          ...rest,
          validated: rest.validated ?? false,
          challenge: {
            connect: {
              id: challenge_id,
            },
          },
          user: {
            connect: {
              id: user_id,
            },
          },
        },
      });
      return new ParticipationEntity(participation);
    } catch (error) {
      this.logger.error('Error creating participation', error);
      throw new BadRequestException(
        'Erreur lors de la création de la participation',
      );
    }
  }

  async findAll() {
    const participations = await this.prisma.participation.findMany({
      include: {
        votes: true,
      },
    });

    return participations.map(
      (participation) => new ParticipationEntity(participation),
    );
  }

  async findOne(id: string) {
    const participation = await this.prisma.participation.findUnique({
      where: { id },
      include: {
        votes: true,
      },
    });

    if (!participation) return null;

    return new ParticipationEntity(participation);
  }

  async findByChallenge(challenge_id: string) {
    const res = await this.prisma.participation.findMany({
      where: { challenge_id },
      include: {
        votes: true,
      },
    });

    return res.map((participation) => new ParticipationEntity(participation));
  }

  async update(id: string, updateParticipationDto: UpdateParticipationDto) {
    try {
      const participation = await this.prisma.participation.update({
        where: { id },
        data: updateParticipationDto,
      });
      return new ParticipationEntity(participation);
    } catch (error) {
      this.logger.error('Error updating participation', error);
      throw new BadRequestException(
        'Erreur lors de la mise à jour de la participation',
      );
    }
  }

  async remove(id: string) {
    try {
      const participation = await this.prisma.participation.delete({
        where: { id },
      });
      return new ParticipationEntity(participation);
    } catch (error) {
      this.logger.error('Error removing participation', error);
      throw new BadRequestException(
        'Erreur lors de la suppression de la participation',
      );
    }
  }
}
