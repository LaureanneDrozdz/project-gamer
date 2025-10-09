import { Test, TestingModule } from '@nestjs/testing';
import { ParticipationController } from './participation.controller';
import { ParticipationService } from './participation.service';
import { JwtAuthGuard } from '../auth-guard/jwt-auth.guard';
import { ParticipationOwnershipGuard } from './participation-ownership.guard';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthentificationService } from '../authentification/authentification.service';

const mockJwtService = {
  verifyAsync: jest.fn(),
};

const mockParticipationService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockJwtGuard = {
  canActivate: jest.fn(),
};

const mockOwnershipGuard = {
  canActivate: jest.fn(),
};

const mockAuthService = {
  decodeToken: jest.fn(),
};

describe('ParticipationController', () => {
  let controller: ParticipationController;
  let jwtGuard: JwtAuthGuard;
  let ownershipGuard: ParticipationOwnershipGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipationController],
      providers: [
        { provide: AuthentificationService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ParticipationService, useValue: mockParticipationService },
        { provide: JwtAuthGuard, useValue: mockJwtGuard },
        { provide: ParticipationOwnershipGuard, useValue: mockOwnershipGuard },
      ],
    }).compile();

    controller = module.get<ParticipationController>(ParticipationController);
    jwtGuard = module.get<JwtAuthGuard>(JwtAuthGuard);
    ownershipGuard = module.get<ParticipationOwnershipGuard>(
      ParticipationOwnershipGuard,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a participation if user is authenticated', async () => {
      const createDto: CreateParticipationDto = {
        user_id: 'user-1',
        challenge_id: 'challenge-1',
        validated: true,
        video_url:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        description: 'Description de la participation',
      };
      const req = { user: { id: 'user-1' } };
      const createdParticipation = { id: '1', ...createDto, user_id: 'user-1' };

      mockParticipationService.create.mockResolvedValue(createdParticipation);
      jest.spyOn(jwtGuard, 'canActivate').mockResolvedValue(true);

      const result = await controller.create(createDto, req);
      expect(result).toEqual(createdParticipation);
      expect(mockParticipationService.create).toHaveBeenCalledWith({
        ...createDto,
        user_id: 'user-1',
      });
    });
  });

  describe('findAll', () => {
    it('should return all participations', async () => {
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
      mockParticipationService.findAll.mockResolvedValue(participations);

      const result = await controller.findAll();
      expect(result).toEqual(participations);
      expect(mockParticipationService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return the participation', async () => {
      const participation = {
        id: 'participation-1',
        user_id: 'user-1',
        challenge_id: 'challenge-1',
        validated: true,
        video_url:
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley',
        description: 'Description de la participation',
        created_at: new Date('2024-01-01T00:00:00Z'),
      };
      mockParticipationService.findOne.mockResolvedValue(participation);

      const result = await controller.findOne('participation-1');
      expect(result).toEqual(participation);
      expect(mockParticipationService.findOne).toHaveBeenCalledWith(
        'participation-1',
      );
    });
  });

  describe('update', () => {
    it('should update participation if user is authorized', async () => {
      const updateDto: UpdateParticipationDto = { validated: true };
      const updatedParticipation = { id: 'participation-1', ...updateDto };

      mockParticipationService.update.mockResolvedValue(updatedParticipation);
      jest.spyOn(ownershipGuard, 'canActivate').mockResolvedValue(true);
      jest.spyOn(jwtGuard, 'canActivate').mockResolvedValue(true);

      const result = await controller.update('participation-1', updateDto);
      expect(result).toEqual(updatedParticipation);
      expect(mockParticipationService.update).toHaveBeenCalledWith(
        'participation-1',
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove participation if user is authorized', async () => {
      mockParticipationService.remove.mockResolvedValue({ deleted: true });

      jest.spyOn(ownershipGuard, 'canActivate').mockResolvedValue(true);
      jest.spyOn(jwtGuard, 'canActivate').mockResolvedValue(true);

      const result = await controller.remove('participation-1');
      expect(result).toEqual({ deleted: true });
      expect(mockParticipationService.remove).toHaveBeenCalledWith(
        'participation-1',
      );
    });
  });
});
