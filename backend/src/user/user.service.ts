import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User as UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        userName: createUserDto.userName,
        email: createUserDto.email,
        password_hash: hashedPassword,
        avatar_url: createUserDto.avatar_url,
      },
    });

    const { password_hash, ...result } = user;
    return result as UserEntity;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => {
      const { password_hash, ...result } = user;
      return result as UserEntity;
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
    return result as unknown as UserEntity;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
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
    return result as UserEntity;
  }

  async delete(id: string): Promise<UserEntity> {
    await this.findOne(id);

    const user = await this.prisma.user.delete({
      where: { id },
    });

    const { password_hash, ...result } = user;
    return result as UserEntity;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const { password_hash, ...result } = user;
    return result as UserEntity;
  }
}
