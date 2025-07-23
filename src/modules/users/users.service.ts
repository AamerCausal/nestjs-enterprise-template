import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UsersRepository } from './repositories/users.repository';
import { User } from './entities/user.entity';
import { Result, ServiceResult } from '../../common/types/result.type';
import { PaginatedResult } from '../../common/interfaces/repository.interface';
import { UserNotFoundException, EmailAlreadyExistsException } from '../../common/exceptions/custom.exceptions';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Result<User, string>> {
    try {
      // Check if user exists
      const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new EmailAlreadyExistsException(createUserDto.email);
      }

      // Create user (password should already be hashed by caller if needed)
      const user = await this.usersRepository.create(createUserDto);

      this.logger.log(`User created successfully: ${user.email}`);
      return ServiceResult.success(user);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      if (error instanceof EmailAlreadyExistsException) {
        return ServiceResult.failure(error.message);
      }
      return ServiceResult.failure('Failed to create user');
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findAllWithPagination(queryDto: GetUsersDto): Promise<Result<PaginatedResult<User>>> {
    try {
      const result = await this.getUsersWithOptimizedQuery(queryDto);
      return ServiceResult.success(result);
    } catch (error) {
      this.logger.error(`Failed to get users: ${error.message}`, error.stack);
      return ServiceResult.failure('Failed to retrieve users');
    }
  }

  async findOne(id: number): Promise<Result<User, string>> {
    try {
      const user = await this.usersRepository.findById(id);
      if (!user) {
        throw new UserNotFoundException(id);
      }
      return ServiceResult.success(user);
    } catch (error) {
      this.logger.error(`Failed to find user ${id}: ${error.message}`, error.stack);
      if (error instanceof UserNotFoundException) {
        return ServiceResult.failure(error.message);
      }
      return ServiceResult.failure('Failed to find user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Result<User, string>> {
    try {
      const existingUser = await this.usersRepository.findById(id);
      if (!existingUser) {
        throw new UserNotFoundException(id);
      }

      // Hash password if provided
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
      }

      const updatedUser = await this.usersRepository.update(id, updateUserDto);

      this.logger.log(`User ${id} updated successfully`);
      return ServiceResult.success(updatedUser);
    } catch (error) {
      this.logger.error(`Failed to update user ${id}: ${error.message}`, error.stack);
      if (error instanceof UserNotFoundException) {
        return ServiceResult.failure(error.message);
      }
      return ServiceResult.failure('Failed to update user');
    }
  }

  async remove(id: number): Promise<Result<boolean, string>> {
    try {
      const existingUser = await this.usersRepository.findById(id);
      if (!existingUser) {
        throw new UserNotFoundException(id);
      }

      const deleted = await this.usersRepository.delete(id);

      this.logger.log(`User ${id} deleted successfully`);
      return ServiceResult.success(deleted);
    } catch (error) {
      this.logger.error(`Failed to delete user ${id}: ${error.message}`, error.stack);
      if (error instanceof UserNotFoundException) {
        return ServiceResult.failure(error.message);
      }
      return ServiceResult.failure('Failed to delete user');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  private async getUsersWithOptimizedQuery(queryDto: GetUsersDto): Promise<PaginatedResult<User>> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.role', 'user.isActive', 'user.createdAt']);

    // Apply filters
    if (queryDto.role) {
      queryBuilder.andWhere('user.role = :role', { role: queryDto.role });
    }

    if (queryDto.isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive: queryDto.isActive });
    }

    if (queryDto.search) {
      queryBuilder.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${queryDto.search}%` }
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`user.${queryDto.sortBy}`, queryDto.order);

    // Apply pagination
    const [items, total] = await queryBuilder
      .skip((queryDto.page - 1) * queryDto.limit)
      .take(queryDto.limit)
      .getManyAndCount();

    return {
      items,
      meta: {
        total,
        page: queryDto.page,
        limit: queryDto.limit,
        totalPages: Math.ceil(total / queryDto.limit),
        hasNext: queryDto.page * queryDto.limit < total,
        hasPrev: queryDto.page > 1,
      },
    };
  }
}
