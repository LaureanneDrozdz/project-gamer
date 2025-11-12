import { Test, TestingModule } from '@nestjs/testing';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { JwtAuthGuard } from '../auth-guard/jwt-auth.guard';
import { VoteOwnershipGuard } from './vote-ownership.guard';
import { CreateVoteDto } from './dto/create-vote.dto';
import { CheckVoteDto } from './dto/check-vote.dto';
import { TargetType } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { AuthentificationService } from '../authentification/authentification.service';

const mockJwtService = {
  verifyAsync: jest.fn(),
};
const mockVoteService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findByTargetId: jest.fn(),
  hasVoted: jest.fn(),
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

describe('VoteController', () => {
  let controller: VoteController;
  let jwtGuard: JwtAuthGuard;
  let ownershipGuard: VoteOwnershipGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoteController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: VoteService, useValue: mockVoteService },
        { provide: JwtAuthGuard, useValue: mockJwtGuard },
        { provide: VoteOwnershipGuard, useValue: mockOwnershipGuard },
        { provide: AuthentificationService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<VoteController>(VoteController);
    jwtGuard = module.get<JwtAuthGuard>(JwtAuthGuard);
    ownershipGuard = module.get<VoteOwnershipGuard>(VoteOwnershipGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a vote if user is authenticated', async () => {
      const createDto: CreateVoteDto = {
        user_id: 'user-1',
        target_id: 'challenge-1',
        target_type: TargetType.CHALLENGE,
      };
      mockVoteService.create.mockResolvedValue({ id: '1', ...createDto });
      jest.spyOn(jwtGuard, 'canActivate').mockResolvedValue(true);

      const result = await controller.create(createDto);
      expect(result).toEqual({ id: '1', ...createDto });
      expect(mockVoteService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findOne', () => {
    it('should return one vote by id', async () => {
      const vote = { id: '1' };
      mockVoteService.findOne.mockResolvedValue(vote);

      const result = await controller.findOne('1');
      expect(result).toEqual(vote);
      expect(mockVoteService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('remove', () => {
    it('should remove vote if user is authorized', async () => {
      mockVoteService.remove.mockResolvedValue({ deleted: true });

      jest.spyOn(ownershipGuard, 'canActivate').mockResolvedValue(true);
      jest.spyOn(jwtGuard, 'canActivate').mockResolvedValue(true);

      const result = await controller.remove('1');
      expect(result).toEqual({ deleted: true });
      expect(mockVoteService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('findByTargetId', () => {
    it('should return votes filtered by target id', async () => {
      const votes = [{ id: '1', target_id: 'target1' }];
      mockVoteService.findByTargetId.mockResolvedValue(votes);

      const result = await controller.findByTargetId('target1');
      expect(result).toEqual(votes);
      expect(mockVoteService.findByTargetId).toHaveBeenCalledWith('target1');
    });
  });

  describe('checkIfVoted', () => {
    it('should return true if user has voted', async () => {
      const checkDto: CheckVoteDto = {
        user_id: 'user-1',
        target_id: 'challenge-1',
        target_type: TargetType.CHALLENGE,
      };

      mockVoteService.hasVoted.mockResolvedValue(true);

      const result = await controller.checkIfVoted(checkDto);
      expect(result).toBe(true);
      expect(mockVoteService.hasVoted).toHaveBeenCalledWith(checkDto);
    });

    it('should return false if user has not voted', async () => {
      const checkDto: CheckVoteDto = {
        user_id: 'user-1',
        target_id: 'challenge-1',
        target_type: TargetType.CHALLENGE,
      };

      mockVoteService.hasVoted.mockResolvedValue(false);

      const result = await controller.checkIfVoted(checkDto);
      expect(result).toBe(false);
      expect(mockVoteService.hasVoted).toHaveBeenCalledWith(checkDto);
    });
  });
});
