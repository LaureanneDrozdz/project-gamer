import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, Roles as DtoRoles } from '../user/dto/create-user.dto';
import { Roles as PrismaRoles } from '@prisma/client';
import { SignInDto } from './dto/sign-in.dto';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'types';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthentificationService {
  private readonly logger = new Logger(AuthentificationService.name);
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // Guard against undefined inputs which cause bcrypt to throw
    if (!password || !hashedPassword) {
      this.logger.warn('comparePasswords called with missing arguments', {
        passwordProvided: password,
        hashedPasswordProvided: hashedPassword,
      });
      return false;
    }
    return bcrypt.compare(password, hashedPassword);
  }

  checkEmailFormat(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Email incorrect');
    }
    return true;
  }

  checkPasswordFormat(password: string) {
    const regex = /^(?=.*\d).{8,}$/;
    if (!regex.test(password)) {
      throw new BadRequestException(
        'Mot de passe trop court ou qui ne correspond pas au format',
      );
    }
    return true;
  }

  async signUp(data: SignUpDto): Promise<{ accessToken: string }> {
    try {
      const randomImage = `https://avatar.iran.liara.run/public/[${Math.floor(Math.random() * 10)}]`;
      const createUserDto: CreateUserDto = {
        ...data,
        role: DtoRoles.USER,
        avatar_url: randomImage,
      };
      const user = await this.usersService.create(createUserDto);

      const apiUser = await this.usersService.findByEmail(data.email);
      const payload = {
        id: apiUser?.id,
        name: user.userName,
        email: user.email,
        role: user.role,
      };
      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (err: unknown) {
      if (err instanceof BadRequestException) throw err;
      this.logger.error('Error during signUp', err);
      throw new BadRequestException('Unable to create user');
    }
  }

  async signIn(data: SignInDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmailWithPassword(data.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.comparePasswords(
      data.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async signInAdmin(data: SignInDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmailWithPassword(data.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.comparePasswords(
      data.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.role !== PrismaRoles.ADMIN) {
      throw new UnauthorizedException('Admin credentials required');
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  decodeToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (err: unknown) {
      this.logger.error('Error decoding token', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
