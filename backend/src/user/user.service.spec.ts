import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, Roles } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return it', async () => {
      const createUserDto: CreateUserDto = {
        userName: 'johndoe',
        email: 'john.doe@example.com',
        password: 'password123',
        avatar_url: 'https://placehold.co/10',
        role: Roles.USER,
      };

      const hashed = await bcrypt.hash(createUserDto.password, 10);

      const createdUser = {
        id: '1',
        userName: createUserDto.userName,
        email: createUserDto.email,
        password_hash: hashed,
        avatar_url: 'https://placehold.co/10',
      };

      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual({
        id: createdUser.id,
        userName: createdUser.userName,
        email: createdUser.email,
        avatar_url: createdUser.avatar_url,
      });
    });
    it('should throw BadRequestException on unique constraint violation', async () => {
      const createUserDto: CreateUserDto = {
        userName: 'johndoe',
        email: 'john.doe@example.com',
        password: 'password123',
        avatar_url: 'https://placehold.co/10',
        role: Roles.USER,
      };

      mockPrismaService.user.create.mockRejectedValue(new Error());

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException on missing required field', async () => {
      const createUserDto = {
        userName: 'johndoe',
        email: '',
        password: 'password123',
        avatar_url: 'https://placehold.co/10',
      };

      mockPrismaService.user.create.mockRejectedValue(new Error());

      await expect(service.create(createUserDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users without password_hash', async () => {
      const users = [
        {
          id: '1',
          userName: 'JohnDoe',
          email: 'john.doe@mail.com',
          password_hash: 'hash1',
          avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        },
        {
          id: '2',
          userName: 'JaneDoe',
          email: 'jane.doe@mail.com',
          password_hash: 'hash2',
          avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: '1',
          userName: 'JohnDoe',
          email: 'john.doe@mail.com',
          avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        },
        {
          id: '2',
          userName: 'JaneDoe',
          email: 'jane.doe@mail.com',
          avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a user without password_hash', async () => {
      const user = {
        id: '1',
        userName: 'JohnDoe',
        email: 'john.doe@mail.com',
        password_hash: 'hash',
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        challenges: [],
        participations: [],
        votes: [],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(result).toEqual({
        id: '1',
        userName: 'JohnDoe',
        email: 'john.doe@mail.com',
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
        challenges: [],
        participations: [],
        votes: [],
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('5')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user and return it', async () => {
      const dto = {
        userName: 'NewName',
        email: 'new@mail.com',
        password: 'newPassword',
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
      };

      const hashed = await bcrypt.hash('password', 10);

      const existingUser = {
        id: '1',
        userName: 'JohnDoe',
        email: 'john.doe@mail.com',
        password_hash: 'oldHash',
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      const updatedUser = {
        id: '1',
        userName: dto.userName,
        email: dto.email,
        password_hash: hashed,
        avatar_url: dto.avatar_url,
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update('1', dto);

      expect(result).toEqual({
        id: '1',
        userName: dto.userName,
        email: dto.email,
        avatar_url: dto.avatar_url,
      });
    });
  });

  describe('delete', () => {
    it('should delete a user and return it', async () => {
      const user = {
        id: '1',
        userName: 'JohnDoe',
        email: 'john.doe@mail.com',
        password_hash: 'hash',
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.user.delete.mockResolvedValue(user);

      const result = await service.delete('1');

      expect(result).toEqual({
        id: '1',
        userName: 'JohnDoe',
        email: 'john.doe@mail.com',
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
      });

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.delete('5')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user without password_hash', async () => {
      const user = {
        id: '1',
        userName: 'JohnDoe',
        email: 'john.doe@mail.com',
        password_hash: 'hash',
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findByEmail('john.doe@mail.com');

      expect(result).toEqual({
        id: '1',
        userName: 'JohnDoe',
        email: 'john.doe@mail.com',
        avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
      });
    });

    it('should return null if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@mail.com');

      expect(result).toBeNull();
    });
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard data', async () => {
      mockPrismaService.user.findMany
        .mockResolvedValueOnce([
          {
            id: '1',
            participations: [
              { votes: [{ id: 'v1' }, { id: 'v2' }] },
              { votes: [] },
            ],
            challenges: [{ id: 'c1' }, { id: 'c2' }],
          },
          {
            id: '2',
            participations: [{ votes: [{ id: 'v3' }] }],
            challenges: [{ id: 'c3' }],
          },
        ])

        .mockResolvedValueOnce([
          {
            id: '1',
            userName: 'johndoe',
            avatar_url: 'https://example.com/avatar1.png',
          },
          {
            id: '2',
            userName: 'janedoe',
            avatar_url: 'https://example.com/avatar2.png',
          },
        ]);

      const result = await service.getLeaderboard();

      expect(result).toEqual([
        {
          id: '1',
          userName: 'johndoe',
          avatar_url: 'https://example.com/avatar1.png',
          score: 18,
        },
        {
          id: '2',
          userName: 'janedoe',
          avatar_url: 'https://example.com/avatar2.png',
          score: 10,
        },
      ]);
    });
  });
});
