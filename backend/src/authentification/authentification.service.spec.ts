import { Test, TestingModule } from '@nestjs/testing';
import { AuthentificationService } from './authentification.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, Roles } from '../user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';

describe('AuthentificationService', () => {
  let service: AuthentificationService;
  const mockUsersService = {
    findByEmailWithPassword: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const mockJwtService = {
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthentificationService,
        { provide: UserService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthentificationService>(AuthentificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('comparePasswords', () => {
    it('should return true when passwords match', async () => {
      const password = 'password';
      const hashed = await bcrypt.hash(password, 10);
      const result = await service.comparePasswords(password, hashed);
      expect(result).toBe(true);
    });

    it('should return false when passwords do not match', async () => {
      const password = 'password';
      const hashed = await bcrypt.hash('otherPassword', 10);
      const result = await service.comparePasswords(password, hashed);
      expect(result).toBe(false);
    });
  });

  describe('signIn', () => {
    it('should return a token', async () => {
      const user = {
        id: 'user-id',
        userName: 'johndoe',
        email: 'john.doe@mail.com',
        created_at: new Date(),
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        challenges: [],
        participations: [],
        votes: [],
        password_hash: 'hashedPassword',
      };

      const credentials: SignInDto = {
        email: user.email,
        password: 'StrongPassword123!',
      };

      mockUsersService.findByEmailWithPassword.mockResolvedValue(user);
      jest.spyOn(service, 'comparePasswords').mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.signIn(credentials);

      expect(result).toEqual({ accessToken: 'token' });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUsersService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(
        service.signIn({
          email: 'john.doe@mail.com',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if password is invalid', async () => {
      const user = {
        id: 'user-id',
        userName: 'johndoe',
        email: 'john.doe@mail.com',
        created_at: new Date(),
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        challenges: [],
        participations: [],
        votes: [],
        password_hash: 'hashedPassword',
      };

      mockUsersService.findByEmailWithPassword.mockResolvedValue(user);
      jest.spyOn(service, 'comparePasswords').mockResolvedValue(false);

      await expect(
        service.signIn({
          email: user.email,
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    it('should throw an error if email is invalid', async () => {
      const user: CreateUserDto = {
        userName: 'johndoe',
        email: 'john.doe.mail.com',
        password: 'StrongPassword123!',
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        role: Roles.USER,
      };

      await expect(service.signUp(user)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if password is too weak', async () => {
      const user: CreateUserDto = {
        userName: 'johndoe',
        email: 'john.doe@mail.com',
        password: 'weak',
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        role: Roles.USER,
      };

      await expect(service.signUp(user)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if email is already in use', async () => {
      const user: CreateUserDto = {
        userName: 'johndoe',
        email: 'john.doe@mail.com',
        password: 'StrongPassword123!',
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        role: Roles.USER,
      };

      mockUsersService.create.mockRejectedValue(
        new BadRequestException('Email is already in use'),
      );

      await expect(service.signUp(user)).rejects.toThrow(
        'Email is already in use',
      );
    });

    it('should successfully register a user with valid data', async () => {
      const user: CreateUserDto = {
        userName: 'johndoe',
        email: 'john.doe@mail.com',
        password: 'StrongPassword123!',
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        role: Roles.USER,
      };

      const createdUser = {
        ...user,
        id: 'user-id',
        created_at: new Date(),
        challenges: [],
        participations: [],
        votes: [],
      };

      mockUsersService.create.mockResolvedValue(createdUser);
      mockUsersService.findByEmail.mockResolvedValue(createdUser);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.signUp(user);

      expect(result).toEqual({ accessToken: 'token' });
    });
  });
});
