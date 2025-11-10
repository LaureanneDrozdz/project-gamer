import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { Prisma } from '.prisma/client/default';
import { User } from '@prisma/client';
// Type describing the shape returned by `fetchUsersForLeaderboard`
type LeaderboardUser = {
  id: string;
  participations: Array<{ votes: Array<{ id: string }> }>;
  challenges: Array<{ id: string }>;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(UserService.name);
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const avatarUrl = this.fetchAvatarUrl();
      const user = await this.prisma.user.create({
        data: {
          userName: createUserDto.userName,
          email: createUserDto.email,
          password_hash: hashedPassword,
          avatar_url: avatarUrl,
        },
      });
      return new UserEntity(user);
    } catch (error: unknown) {
      this.logger.error('Error creating user', error);
      throw new BadRequestException(`Invalid Data for User Creation`);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => {
      return new UserEntity(user);
    });
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        challenges: true,
        participations: true,
        votes: { include: { user: true } },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return new UserEntity(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      await this.findOne(id);

      const data: Partial<Prisma.UserUpdateInput> = {};

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

      return new UserEntity(updatedUser);
    } catch (error: unknown) {
      this.logger.error('Error updating user', error);
      throw new BadRequestException('Invalid Data for User Update');
    }
  }

  async delete(id: string): Promise<UserEntity> {
    await this.findOne(id);

    const user = await this.prisma.user.delete({
      where: { id },
    });

    return new UserEntity(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }
    return new UserEntity(user);
  }
  // Return the raw Prisma User object (includes password_hash) so
  // authentication code can compare passwords.
  async findByEmailWithPassword(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return user;
  }

  // Helper: fetch users with the relations needed to compute leaderboard
  private async fetchUsersForLeaderboard() {
    return this.prisma.user.findMany({
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
  }

  // Helper: compute the score for a single user record (from prisma select)
  private calculateScoreForUser(
    user: LeaderboardUser,
    weights: {
      validatedParticipation: number;
      vote: number;
      challengeCreated: number;
    },
  ) {
    const validatedParticipations = user.participations.length;
    const votesOnParticipation = user.participations.reduce(
      (sum: number, participation: { votes: { id: string }[] }) =>
        sum + participation.votes.length,
      0,
    );
    const challengesCreated = user.challenges.length;

    const score =
      validatedParticipations * weights.validatedParticipation +
      votesOnParticipation * weights.vote +
      challengesCreated * weights.challengeCreated;

    return { id: user.id, score };
  }

  private fetchAvatarUrl(): string {
    // UUID temporaire pour seed de l'avatar
    const tempUuid = 'temporary-uuid-for-avatar-seed';
    return `https://api.dicebear.com/9.x/bottts/png?seed=${tempUuid}`;
  }

  // Helper: fetch display details for a list of user ids
  private async fetchUserDetailsByIds(ids: string[]) {
    if (!ids.length) return [];
    return this.prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, userName: true, avatar_url: true },
    });
  }

  // Public method: orchestrates helpers to build the leaderboard
  async getLeaderboard(limit = 10) {
    const weights = {
      validatedParticipation: 5,
      vote: 2,
      challengeCreated: 1,
    };

    const users = await this.fetchUsersForLeaderboard();

    const leaderboardData = users.map((user) =>
      this.calculateScoreForUser(user, weights),
    );

    const topUsers = leaderboardData
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    const userDetails = await this.fetchUserDetailsByIds(
      topUsers.map((u) => u.id),
    );

    const leaderboard = topUsers.map((u) => ({
      ...userDetails.find((d) => d.id === u.id),
      score: u.score,
    }));

    return leaderboard;
  }
}
