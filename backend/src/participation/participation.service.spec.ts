import { Test, TestingModule } from '@nestjs/testing';
import { ParticipationService } from './participation.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { BadRequestException } from '@nestjs/common';

describe('ParticipationService', () => {
  let service: ParticipationService;
  let prisma: PrismaService;

  const mockPrisma = {
    participation: {
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
        ParticipationService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ParticipationService>(ParticipationService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a participation', async () => {
      const dto: CreateParticipationDto = {
        user_id: 'user-1',
        challenge_id: 'challenge-1',
        validated: true,
        video_url:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        description: 'Description de la participation',
      };

      const createdParticipation = {
        id: 'participation-1',
        user_id: dto.user_id,
        challenge_id: dto.challenge_id,
        validated: true,
        video_url: dto.video_url,
        description: dto.description,
      };

      mockPrisma.participation.create.mockResolvedValue(createdParticipation);

      const result = await service.create(dto);

      expect(prisma.participation.create).toHaveBeenCalledWith({
        data: {
          validated: true,
          video_url: dto.video_url,
          description: dto.description,
          challenge: { connect: { id: dto.challenge_id } },
          user: { connect: { id: dto.user_id } },
        },
      });

      expect(result).toEqual(createdParticipation);
    });

    it('should throw BadRequestException if user_id is missing', async () => {
      const dto: Partial<CreateParticipationDto> = {
        challenge_id: 'challenge-1',
        user_id: '',
        validated: true,
        video_url:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        description: 'Description de la participation',
      };

      await expect(
        service.create(dto as CreateParticipationDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if challenge_id is missing', async () => {
      const dto: Partial<CreateParticipationDto> = {
        challenge_id: '',
        validated: true,
        video_url:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        description: 'Description de la participation',
      };

      await expect(
        service.create(dto as CreateParticipationDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all participations with created_at as ISO string', async () => {
      const participations = [
        {
          id: 'participation-1',
          user_id: 'user-1',
          challenge_id: 'challenge-1',
          video_url:
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
          description: 'Description de la participation 1',
          validated: true,
          created_at: new Date('2024-01-01T00:00:00Z'),
        },
        {
          id: 'participation-2',
          user_id: 'user-2',
          challenge_id: 'challenge-2',
          video_url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
          description: 'Description de la participation 2',
          validated: false,
          created_at: new Date('2024-01-02T00:00:00Z'),
        },
      ];

      mockPrisma.participation.findMany.mockResolvedValue(participations);

      const result = await service.findAll();

      const formatted = result.map((p) => ({
        ...p,
        created_at: p.created_at,
      }));

      expect(formatted).toEqual([
        { ...participations[0], created_at: '2024-01-01T00:00:00.000Z' },
        { ...participations[1], created_at: '2024-01-02T00:00:00.000Z' },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a participation', async () => {
      const participation = {
        id: 'participation-1',
        user_id: 'user-1',
        challenge_id: 'challenge-1',
        validated: true,
        video_url:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        description: 'Description de la participation',
        created_at: '2024-01-01T00:00:00Z',
      };

      mockPrisma.participation.findUnique.mockResolvedValue(participation);
      const result = await service.findOne('participation-1');

      expect(prisma.participation.findUnique).toHaveBeenCalledWith({
        where: { id: 'participation-1' },
        include: { votes: true },
      });

      expect({
        ...result!,
        created_at: result!.created_at,
      }).toMatchObject({
        ...participation,
        created_at: participation.created_at,
      });
    });

    it('should return null if participation not found', async () => {
      mockPrisma.participation.findUnique.mockResolvedValue(null);
      const result = await service.findOne('unknown-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a participation', async () => {
      const dto: UpdateParticipationDto = { validated: true };
      mockPrisma.participation.update.mockResolvedValue({
        id: 'participation-1',
        ...dto,
      });

      const result = await service.update('participation-1', dto);

      expect(prisma.participation.update).toHaveBeenCalledWith({
        where: { id: 'participation-1' },
        data: dto,
      });

      expect(result).toEqual({
        id: 'participation-1',
        validated: true,
      });
    });
  });

  describe('remove', () => {
    it('should delete a participation', async () => {
      mockPrisma.participation.delete.mockResolvedValue({
        id: 'participation-1',
      });
      const result = await service.remove('participation-1');

      expect(prisma.participation.delete).toHaveBeenCalledWith({
        where: { id: 'participation-1' },
      });
      expect(result).toEqual({ id: 'participation-1' });
    });
  });
});
