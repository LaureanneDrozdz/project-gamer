import { Test, TestingModule } from '@nestjs/testing';
import { VoteService } from './vote.service';
import { PrismaService } from '../prisma/prisma.service';
import { TargetType } from '@prisma/client';
import { EventBusService } from '../events/event-bus.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { CheckVoteDto } from './dto/check-vote.dto';

describe('VoteService', () => {
  let service: VoteService;

  const mockPrisma = {
    vote: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: EventBusService,
          useValue: { emit: jest.fn(), on: jest.fn(), once: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<VoteService>(VoteService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a vote linked to a challenge', async () => {
      const dto: CreateVoteDto = {
        user_id: 'user-1',
        target_id: 'challenge-1',
        target_type: TargetType.CHALLENGE,
      };

      mockPrisma.vote.create.mockResolvedValue({ id: 'vote-1', ...dto });

      const result = await service.create(dto);

      expect(mockPrisma.vote.create).toHaveBeenCalledWith({
        data: {
          target_type: dto.target_type,
          challenge: {
            connect: { id: dto.target_id },
          },
          user: {
            connect: { id: dto.user_id },
          },
        },
      });

      expect(result).toEqual({ id: 'vote-1', ...dto });
    });

    it('should throw error if target_type is invalid', async () => {
      const dto: any = {
        user_id: 'user-3',
        target_id: 'some-id',
        target_type: 'INVALID',
      };

      return expect(service.create(dto)).rejects.toThrowError(
        'target_type invalide',
      );
    });

    it('should throw error if target_id is missing', async () => {
      const dto: any = {
        user_id: 'user-4',
        target_type: TargetType.CHALLENGE,
      };

      return expect(service.create(dto)).rejects.toThrowError(
        'target_id est obligatoire',
      );
    });
  });

  describe('findOne', () => {
    it('should return a vote by id', async () => {
      mockPrisma.vote.findUnique.mockResolvedValue({ id: 'vote-1' });

      const result = await service.findOne('vote-1');

      expect(result).toEqual({ id: 'vote-1' });
      expect(mockPrisma.vote.findUnique).toHaveBeenCalledWith({
        where: { id: 'vote-1' },
      });
    });
  });

  describe('remove', () => {
    it('should delete a vote', async () => {
      mockPrisma.vote.delete.mockResolvedValue({ id: 'vote-1' });

      const result = await service.remove('vote-1');

      expect(result).toEqual({ id: 'vote-1' });
      expect(mockPrisma.vote.delete).toHaveBeenCalledWith({
        where: { id: 'vote-1' },
      });
    });
  });

  describe('findByTargetId', () => {
    it('should find votes for given target id', async () => {
      const votes = [
        { id: 'vote-1', challenge_id: 'challenge-1' },
        { id: 'vote-2', participation_id: 'challenge-1' },
      ];

      mockPrisma.vote.findMany.mockResolvedValue(votes);

      const result = await service.findByTargetId('challenge-1');

      expect(result).toEqual(votes);
      expect(mockPrisma.vote.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { challenge_id: 'challenge-1' },
            { participation_id: 'challenge-1' },
          ],
        },
        include: {
          challenge: true,
          participation: true,
        },
      });
    });
  });

  describe('hasVoted', () => {
    it('should return true and vote id if user has voted for a challenge', async () => {
      mockPrisma.vote.findFirst.mockResolvedValue({
        id: 'vote-1',
        user_id: 'user-1',
        challenge_id: 'challenge-1',
      });

      const dto: CheckVoteDto = {
        user_id: 'user-1',
        target_id: 'challenge-1',
        target_type: TargetType.CHALLENGE,
      };

      const result = await service.hasVoted(dto);

      expect(result).toEqual({ hasVoted: true, voteId: 'vote-1' });
      expect(mockPrisma.vote.findFirst).toHaveBeenCalledWith({
        where: {
          user_id: dto.user_id,
          challenge_id: dto.target_id,
        },
      });
    });

    it('should return false if user has not voted', async () => {
      mockPrisma.vote.findFirst.mockResolvedValue(null);

      const dto: CheckVoteDto = {
        user_id: 'user-1',
        target_id: 'participation-1',
        target_type: TargetType.PARTICIPATION,
      };

      const result = await service.hasVoted(dto);

      expect(result).toEqual({ hasVoted: false, voteId: undefined });
      expect(mockPrisma.vote.findFirst).toHaveBeenCalledWith({
        where: {
          user_id: dto.user_id,
          participation_id: dto.target_id,
        },
      });
    });
  });
});
