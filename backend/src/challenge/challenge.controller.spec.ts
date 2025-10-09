import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { AuthentificationService } from '../authentification/authentification.service';
import { JwtAuthGuard } from '../auth-guard/jwt-auth.guard';
import { ChallengeOwnershipGuard } from './challenge-ownership.guard';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { Difficulty } from './entities/challenge.entity';
import { JwtService } from '@nestjs/jwt';

const mockChallengeService = {
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockAuthService = {
  decodeToken: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
};

const mockJwtGuard = {
  canActivate: jest.fn(),
};

const mockChallengeOwnershipGuard = {
  canActivate: jest.fn(),
};

describe('ChallengeController Integration avec Guards', () => {
  let controller: ChallengeController;
  let jwtGuard: JwtAuthGuard;
  let ownershipGuard: ChallengeOwnershipGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengeController],
      providers: [
        { provide: ChallengeService, useValue: mockChallengeService },
        { provide: AuthentificationService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: JwtAuthGuard, useValue: mockJwtGuard },
        {
          provide: ChallengeOwnershipGuard,
          useValue: mockChallengeOwnershipGuard,
        },
      ],
    }).compile();

    controller = module.get<ChallengeController>(ChallengeController);
    jwtGuard = module.get<JwtAuthGuard>(JwtAuthGuard);
    ownershipGuard = module.get<ChallengeOwnershipGuard>(
      ChallengeOwnershipGuard,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ChallengeController', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should create a challenge if the user is authenticated', async () => {
      const createChallengeDto: CreateChallengeDto = {
        title: 'Speedrun World 1-1',
        description:
          'Terminez le premier niveau du jeu en moins de 30 secondes',
        rules:
          'Pas de bugs ou glitches autorisés. Le chrono commence dès que le niveau est chargé.',
        game: 'Super Mario Bros',
        difficulty: Difficulty.MEDIUM,
        validated: false,
        user_id: 'user123',
        image_url: 'https://via.assets.so/game.webp?id=3',
      };
      mockChallengeService.create.mockResolvedValue({
        id: 'challenge-1',
        ...createChallengeDto,
      });

      jest.spyOn(jwtGuard, 'canActivate').mockResolvedValue(true);

      const result = await controller.create(createChallengeDto);
      expect(result).toEqual({ id: 'challenge-1', ...createChallengeDto });
      expect(mockChallengeService.create).toHaveBeenCalledWith(
        createChallengeDto,
      );
    });

    it('should update a challenge if the user is authorized', async () => {
      const updateDto = { title: 'update' };
      mockChallengeService.update.mockResolvedValue({
        id: 'challenge-1',
        ...updateDto,
      });

      jest.spyOn(ownershipGuard, 'canActivate').mockResolvedValue(true);

      const result = await controller.update('challenge-1', updateDto);
      expect(result).toEqual({ id: 'challenge-1', ...updateDto });
      expect(mockChallengeService.update).toHaveBeenCalledWith(
        'challenge-1',
        updateDto,
      );
    });

    it('should remove a challenge if the user is authorized', async () => {
      mockChallengeService.remove.mockResolvedValue({ deleted: true });
      jest.spyOn(ownershipGuard, 'canActivate').mockResolvedValue(true);

      const result = await controller.remove('challenge-1');
      expect(result).toEqual({ deleted: true });
      expect(mockChallengeService.remove).toHaveBeenCalledWith('challenge-1');
    });
  });
});
