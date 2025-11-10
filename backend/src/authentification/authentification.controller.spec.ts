import { Test, TestingModule } from '@nestjs/testing';
import { AuthentificationController } from './authentification.controller';
import { AuthentificationService } from './authentification.service';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto, Roles } from '../user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';

describe('AuthentificationController', () => {
  let controller: AuthentificationController;

  const mockAuthentificationService = {
    signIn: jest.fn(),
    signUp: jest.fn(),
    decodeToken: jest.fn(),
  };
  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthentificationController],
      providers: [
        {
          provide: AuthentificationService,
          useValue: mockAuthentificationService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<AuthentificationController>(
      AuthentificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should call service.signIn and return access token', async () => {
      const signInDto: SignInDto = {
        email: 'john.doe@mail.com',
        password: 'password123',
      };
      const result = { accessToken: 'token' };
      mockAuthentificationService.signIn.mockResolvedValue(result);

      expect(await controller.signIn(signInDto)).toEqual(result);
      expect(mockAuthentificationService.signIn).toHaveBeenCalledWith(
        signInDto,
      );
    });
  });

  describe('signUp', () => {
    it('should call service.signUp and return access token', async () => {
      const createUserDto: CreateUserDto = {
        userName: 'john',
        email: 'john.doe@mail.com',
        password: 'password123',
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        role: Roles.USER,
      };
      const result = { accessToken: 'token' };
      mockAuthentificationService.signUp.mockResolvedValue(result);

      expect(await controller.signUp(createUserDto)).toEqual(result);
      expect(mockAuthentificationService.signUp).toHaveBeenCalledWith(
        createUserDto,
      );
    });
  });

  describe('decodeToken', () => {
    it('should throw UnauthorizedException if authorization header is missing', async () => {
      const emptyReq = { cookies: {} } as unknown as Request;
      await expect(controller.decodeToken(emptyReq)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should extract token from cookie, call service.decodeToken and return user entity', async () => {
      const decodedPayload = { id: 'user-id' };
      const userEntity = {
        id: 'user-id',
        userName: 'johndoe',
        email: 'john.doe@mail.com',
        created_at: new Date().toISOString(),
        avatar_url: 'https://example.com/avatar.png',
        challenges: [],
        participations: [],
        votes: [],
        role: 'USER',
      };
      mockAuthentificationService.decodeToken.mockReturnValue(decodedPayload);
      mockUserService.findOne.mockResolvedValue(userEntity);
      const req = { cookies: { token: 'faketoken123' } } as unknown as Request;

      await expect(controller.decodeToken(req)).resolves.toEqual(userEntity);
      expect(mockAuthentificationService.decodeToken).toHaveBeenCalledWith(
        'faketoken123',
      );
      expect(mockUserService.findOne).toHaveBeenCalledWith('user-id');
    });

    it('should pass through token even if it has surrounding spaces (no trimming in controller)', async () => {
      const decodedPayload = { id: 'user-id' };
      const userEntity = { id: 'user-id' } as any;
      mockAuthentificationService.decodeToken.mockReturnValue(decodedPayload);
      mockUserService.findOne.mockResolvedValue(userEntity);
      const req = { cookies: { token: '  faketoken123  ' } } as unknown as Request;

      await expect(controller.decodeToken(req)).resolves.toEqual(userEntity);
      expect(mockAuthentificationService.decodeToken).toHaveBeenCalledWith(
        '  faketoken123  ',
      );
      expect(mockUserService.findOne).toHaveBeenCalledWith('user-id');
    });
  });
});
