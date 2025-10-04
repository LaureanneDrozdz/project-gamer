import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User as UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          userName: createUserDto.userName,
          email: createUserDto.email,
          password_hash: hashedPassword,
          avatar_url: 'https://placehold.co/10',
        },
      });

  const { password_hash, ...result } = user;
  return new UserEntity(result);
    } catch (error) {
      throw new BadRequestException(`Invalid Data: ${error.message}`);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => {
      const { password_hash, ...result } = user;
      return new UserEntity(result as any);
    });
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        challenges: true,
        participations: true,
        votes: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  const { password_hash, ...result } = user;
  return new UserEntity(result);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      await this.findOne(id);

      const data: any = {};

      if (updateUserDto.userName) {
        data.userName = updateUserDto.userName;
      }

      if (updateUserDto.email) {
        data.email = updateUserDto.email;
      }

      if (updateUserDto.password) {
        data.password_hash = await bcrypt.hash(updateUserDto.password, 10);
      }

      if (updateUserDto.avatar_url) {
        data.avatar_url = updateUserDto.avatar_url;
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
      });

      const { password_hash, ...result } = updatedUser;
      return new UserEntity(result);
    } catch (error) {
      throw new BadRequestException('Invalid Data for User Update');
    }
  }

  async delete(id: string): Promise<UserEntity> {
    await this.findOne(id);

    const user = await this.prisma.user.delete({
      where: { id },
    });

    const { password_hash, ...result } = user;
    return new UserEntity(result);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const { password_hash, ...result } = user;
    return new UserEntity(result);
  }
  async findByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getLeaderboard(limit = 10) {
    const weights = {
      validatedParticipation: 5,
      vote: 2,
      challengeCreated: 1,
    };

    // Retrieve users with their validated participations and the number of votes
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        participations: {
          where: { validated: true },
          select: {
            votes: { select: { id: true } },
          },
        },
        challenges: { select: { id: true } },
      },
    });

    const leaderboardData = users.map((user) => {
      // Number of validated participations
      const validatedParticipations = user.participations.length;
      // Number of votes received by the participations
      const votesOnParticipation = user.participations.reduce(
        (sum, participation) => sum + participation.votes.length,
        1,
      );
      // Number of challenges created by the user
      const challengesCreated = user.challenges.length;

      const score =
        validatedParticipations * weights.validatedParticipation +
        votesOnParticipation * weights.vote +
        challengesCreated * weights.challengeCreated;

      // For each user, return their ID and score
      return {
        id: user.id,
        score,
      };
    });

    // Sort users by score and keep only the top 'limit' users
    const topUsers = leaderboardData
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Fetch username and avatar for the top users
    const userDetails = await this.prisma.user.findMany({
      where: { id: { in: topUsers.map((u) => u.id) } },
      select: { id: true, userName: true, avatar_url: true },
    });

    // Combine score with user details for the leaderboard
    const leaderboard = topUsers.map((u) => ({
      ...userDetails.find((d) => d.id === u.id),
      score: u.score,
    }));

    return leaderboard;
  }
}
