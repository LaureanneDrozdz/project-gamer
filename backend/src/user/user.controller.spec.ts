import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, Roles } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


describe('UserController', () => {
  let controller: UserController;
  let mockUserService = {
    getLeaderboard: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('leaderboard', () => {
    it('should return top 10 users by default', async () => {
      const mockResult = [{ userName: 'topuser', score: 100 }];
      (mockUserService.getLeaderboard as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const result = await controller.leaderboard();
      expect(result).toEqual(mockResult);
      expect(mockUserService.getLeaderboard).toHaveBeenCalledWith(10);
    });

    it('should return top N users when limit is provided', async () => {
      await controller.leaderboard('5');
      expect(mockUserService.getLeaderboard).toHaveBeenCalledWith(5);
    });
  });

  describe('create', () => {
    it('should create a user and call service with correct data', async () => {
      const createUserDto: CreateUserDto = {
        userName: 'john',
        email: 'john@example.com',
        password: 'password123',
        avatar_url: 'https://placehold.co/10',
        role: Roles.USER,
      };

      const mockResult = { id: '1', ...createUserDto, password_hash: 'hashed' };
      (mockUserService.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockResult);
      expect(mockUserService.create).toHaveBeenCalledWith({
        ...createUserDto,
        password_hash: createUserDto.password,
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: '1' }, { id: '2' }];
      (mockUserService.findAll as jest.Mock).mockResolvedValue(users);
      const result = await controller.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return one user', async () => {
      const user = { id: '123', userName: 'test' };
      (mockUserService.findOne as jest.Mock).mockResolvedValue(user);
      const result = await controller.findOne('123');
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update the user', async () => {
      const updateDto: UpdateUserDto = { userName: 'newname' };
      const updatedUser = { id: '1', userName: 'newname' };
      (mockUserService.update as jest.Mock).mockResolvedValue(updatedUser);
      const result = await controller.update('1', updateDto);
      expect(result).toEqual(updatedUser);
      expect(mockUserService.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should delete the user', async () => {
      (mockUserService.delete as jest.Mock).mockResolvedValue({
        deleted: true,
      });
      const result = await controller.remove('1');
      expect(result).toEqual({ deleted: true });
      expect(mockUserService.delete).toHaveBeenCalledWith('1');
    });
  });
});
