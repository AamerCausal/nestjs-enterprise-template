import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    role: UserRole.USER,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUsersRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findWithPagination: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);

    // Setup bcrypt mock
    mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should create user successfully', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe(createUserDto.email);
      }
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 12);
    });

    it('should fail when email already exists', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('already exists');
      }
      expect(usersRepository.create).not.toHaveBeenCalled();
    });

    it('should handle creation errors', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.create.mockRejectedValue(new Error('Database error'));

      const result = await service.create(createUserDto);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Failed to create user');
      }
    });
  });

  describe('findOne', () => {
    it('should find user by id successfully', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockUser);
      }
      expect(usersRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should fail when user not found', async () => {
      usersRepository.findById.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('not found');
      }
    });
  });

  describe('findAllWithPagination', () => {
    const queryDto: GetUsersDto = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      order: 'ASC',
    };

    const mockPaginatedResult = {
      items: [mockUser],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };

    it('should fetch paginated users successfully', async () => {
      // Mock the optimized query method
      const getUsersWithOptimizedQuerySpy = jest
        .spyOn(service as any, 'getUsersWithOptimizedQuery')
        .mockResolvedValue(mockPaginatedResult);

      const result = await service.findAllWithPagination(queryDto);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockPaginatedResult);
      }
      expect(getUsersWithOptimizedQuerySpy).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('update', () => {
    const updateUserDto = { name: 'Jane Doe' };

    it('should update user successfully', async () => {
      const updatedUser = { ...mockUser, name: 'Jane Doe' };
      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Jane Doe');
      }
    });

    it('should fail when user not found', async () => {
      usersRepository.findById.mockResolvedValue(null);

      const result = await service.update(999, updateUserDto);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('not found');
      }
    });
  });

  describe('remove', () => {
    it('should delete user successfully', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.delete.mockResolvedValue(true);

      const result = await service.remove(1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(true);
      }
    });

    it('should fail when user not found', async () => {
      usersRepository.findById.mockResolvedValue(null);

      const result = await service.remove(999);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('not found');
      }
    });
  });
});
