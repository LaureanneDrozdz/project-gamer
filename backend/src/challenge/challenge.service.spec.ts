import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeService } from './challenge.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { BadRequestException } from '@nestjs/common';
import { Difficulty } from './entities/challenge.entity';

describe('ChallengeService', () => {
  let service: ChallengeService;
  let prisma: PrismaService;

  const mockPrisma = {
    challenge: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengeService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ChallengeService>(ChallengeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a challenge with provided image_url', async () => {
      const dto: CreateChallengeDto = {
        title: 'Speedrun World 1-1',
        description: 'Complete level 1-1 in under 30 seconds',
        rules: 'No glitches allowed',
        game: 'Super Mario Bros',
        difficulty: Difficulty.MEDIUM,
        validated: false,
        user_id: 'user-123',
        image_url: 'https://via.assets.so/game.webp?id=3',
      };

      const createdChallenge = {
        id: 'challenge-1',
        ...dto,
        created_at: new Date(),
      };

      mockPrisma.challenge.create.mockResolvedValue(createdChallenge);

      const result = await service.create(dto);

      expect(mockPrisma.challenge.create).toHaveBeenCalledWith({
        data: {
          title: dto.title,
          description: dto.description,
          rules: dto.rules,
          game: dto.game,
          difficulty: dto.difficulty,
          validated: dto.validated,
          image_url: dto.image_url,
          creator: {
            connect: {
              id: dto.user_id,
            },
          },
        },
      });

      expect(result).toEqual(createdChallenge);
    });

    it('should throw BadRequestException on prisma error', async () => {
      const dto: CreateChallengeDto = {
        title: '',
        description: 'Complete level 1-1 in under 30 seconds',
        rules: 'No glitches allowed',
        game: 'Super Mario Bros',
        difficulty: Difficulty.MEDIUM,
        validated: false,
        user_id: 'user-123',
        image_url: 'https://via.assets.so/game.webp?id=3',
      };

      mockPrisma.challenge.create.mockRejectedValue(new Error());

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all challenges', async () => {
      const challenges = [
        {
          id: 'challenge-1',
          title: 'Speedrun',
          created_at: new Date('2025-01-01T10:00:00.000Z'),
          votes: [{ id: 'vote1' }],
          participations: [{ id: 'part1' }],
          rules: 'No glitches allowed',
          game: 'Super Mario Bros',
          difficulty: Difficulty.MEDIUM,
          validated: false,
          user_id: 'user-123',
          image_url: 'https://via.assets.so/game.webp?id=3',
        },
        {
          id: 'challenge-2',
          title: 'Marathon',
          created_at: new Date('2025-02-02T12:00:00.000Z'),
          votes: [],
          participations: [],
          rules: 'No glitches allowed',
          game: 'Super Mario Bros',
          difficulty: Difficulty.MEDIUM,
          validated: false,
          user_id: 'user-123',
          image_url: 'https://via.assets.so/game.webp?id=3',
        },
      ];

      mockPrisma.challenge.findMany.mockResolvedValue(challenges);

      const result = await service.findAll();
      const formatted = result.map((challenge) => ({
        ...challenge,
        created_at: challenge.created_at.toISOString(),
      }));
      expect(formatted).toEqual([
        { ...challenges[0], created_at: '2025-01-01T10:00:00.000Z' },
        { ...challenges[1], created_at: '2025-02-02T12:00:00.000Z' },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a challenge', async () => {
      const challenge = {
        id: 'challenge-1',
        title: 'Speedrun',
        created_at: new Date('2025-01-01T10:00:00Z'),
        votes: [],
        participations: [],
        creator: { userName: 'Alice' },
        rules: 'No glitches allowed',
        game: 'Super Mario Bros',
        difficulty: Difficulty.MEDIUM,
        validated: false,
        user_id: 'user-123',
        image_url: 'https://via.assets.so/game.webp?id=3',
      };

      mockPrisma.challenge.findUnique.mockResolvedValue(challenge);

      const result = await service.findOne('challenge-1');

      expect(result).toMatchObject({
        ...challenge,
        created_at: new Date(challenge.created_at).toISOString(),
      });
    });

    it('should return null if challenge not found', async () => {
      mockPrisma.challenge.findUnique.mockResolvedValue(null);
      const result = await service.findOne('not-found-id');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a challenge', async () => {
      const dto = { title: 'Updated title' };

      const updatedChallenge = {
        id: 'challenge-1',
        ...dto,
      };

      mockPrisma.challenge.update.mockResolvedValue(updatedChallenge);

      const result = await service.update('challenge-1', dto);

      expect(result).toEqual(updatedChallenge);
    });
  });

  describe('remove', () => {
    it('should delete a challenge', async () => {
      const deletedChallenge = { id: 'challenge-1' };

      mockPrisma.challenge.delete.mockResolvedValue(deletedChallenge);

      const result = await service.remove('challenge-1');

      expect(result).toEqual(deletedChallenge);
    });
  });
});
