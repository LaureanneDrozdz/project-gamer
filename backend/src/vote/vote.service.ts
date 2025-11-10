import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { TargetType } from '@prisma/client';
import { CheckVoteDto } from './dto/check-vote.dto';
import { VoteEntity } from './entities/vote.entity';

@Injectable()
export class VoteService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(VoteService.name);
  async create(createVoteDto: CreateVoteDto) {
    const { user_id, target_id, target_type, ...rest } = createVoteDto;
    if (!target_id) {
      throw new Error('target_id est obligatoire');
    }

    let targetData: Record<string, any> = {};
    if (target_type === TargetType.CHALLENGE) {
      targetData = {
        challenge: {
          connect: { id: target_id },
        },
      };
    } else if (target_type === TargetType.PARTICIPATION) {
      targetData = {
        participation: {
          connect: { id: target_id },
        },
      };
    } else {
      throw new Error('target_type invalide');
    }
    // Prevent duplicate votes: if this user already voted for this target, reject
    const existing = await this.prisma.vote.findFirst({
      where: {
        user_id,
        ...(target_type === TargetType.CHALLENGE
          ? { challenge_id: target_id }
          : { participation_id: target_id }),
      },
    });
    if (existing) {
      throw new ConflictException('User has already voted for this target');
    }
    const vote = await this.prisma.vote.create({
      data: {
        ...rest,
        target_type,
        ...targetData,

        user: {
          connect: {
            id: user_id,
          },
        },
      },
    });

    return new VoteEntity(vote);
  }

  async findAll() {
    const votes = await this.prisma.vote.findMany();
    return votes.map((vote) => new VoteEntity(vote));
  }

  async findOne(id: string) {
    const vote = await this.prisma.vote.findUnique({
      where: { id },
    });
    if (!vote) {
      throw new NotFoundException(`Vote with id ${id} not found`);
    }
    return new VoteEntity(vote);
  }

  async update(id: string, updateVoteDto: UpdateVoteDto) {
    try {
      const vote = await this.prisma.vote.update({
        where: { id },
        data: updateVoteDto,
      });
      return new VoteEntity(vote);
    } catch (error) {
      this.logger.error('Error updating vote', error);
      throw new NotFoundException(`Vote with id ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      const vote = await this.prisma.vote.delete({
        where: { id },
      });
      return new VoteEntity(vote);
    } catch (error) {
      this.logger.error('Error removing vote', error);
      throw new NotFoundException(`Vote with id ${id} not found`);
    }
  }
  findByTargetId(targetId: string) {
    return this.prisma.vote.findMany({
      where: {
        OR: [{ challenge_id: targetId }, { participation_id: targetId }],
      },
      include: {
        challenge: true,
        participation: true,
      },
    });
  }

  async hasVoted(
    checkVoteDto: CheckVoteDto,
  ): Promise<{ hasVoted: boolean; voteId?: string }> {
    const { user_id, target_id, target_type } = checkVoteDto;

    const result = await this.prisma.vote.findFirst({
      where: {
        user_id,
        ...(target_type === TargetType.CHALLENGE
          ? { challenge_id: target_id }
          : { participation_id: target_id }),
      },
    });

    if (result) {
      return { hasVoted: true, voteId: result.id };
    }
    return { hasVoted: false, voteId: undefined };
  }
}
