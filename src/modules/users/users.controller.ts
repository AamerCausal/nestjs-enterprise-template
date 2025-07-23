import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { ApiResponseDto, PaginatedResponseDto } from '../../common/dto/api-response.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: ApiResponseDto<User>,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists' })
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponseDto<User>> {
    const result = await this.usersService.create(createUserDto);

    if (!result.success) {
      const error = (result as any).error;
      this.logger.warn(`Failed to create user: ${error}`);
      return {
        success: false,
        message: 'Failed to create user',
        error,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      message: 'User created successfully',
      data: result.data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({
    summary: 'Get all users with pagination and filtering',
    description: 'Retrieve a paginated list of users with optional filtering and sorting',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users retrieved successfully',
    type: PaginatedResponseDto<User>,
  })
  async findAll(@Query() queryDto: GetUsersDto): Promise<PaginatedResponseDto<User>> {
    const result = await this.usersService.findAllWithPagination(queryDto);

    if (!result.success) {
      const error = (result as any).error;
      this.logger.error(`Failed to retrieve users: ${error}`);
      return {
        success: false,
        message: 'Failed to retrieve users',
        error,
        timestamp: new Date().toISOString(),
        meta: {
          total: 0,
          page: queryDto.page || 1,
          limit: queryDto.limit || 10,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    return {
      success: true,
      message: 'Users retrieved successfully',
      data: result.data.items,
      meta: result.data.meta,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found',
    type: ApiResponseDto<User>,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<User>> {
    const result = await this.usersService.findOne(+id);

    if (!result.success) {
      const error = (result as any).error;
      this.logger.warn(`User not found: ${id}`);
      return {
        success: false,
        message: 'User not found',
        error,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      message: 'User found',
      data: result.data,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: ApiResponseDto<User>,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseDto<User>> {
    const result = await this.usersService.update(+id, updateUserDto);

    if (!result.success) {
      const error = (result as any).error;
      this.logger.warn(`Failed to update user ${id}: ${error}`);
      return {
        success: false,
        message: 'Failed to update user',
        error,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      message: 'User updated successfully',
      data: result.data,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<ApiResponseDto<boolean>> {
    const result = await this.usersService.remove(+id);

    if (!result.success) {
      const error = (result as any).error;
      this.logger.warn(`Failed to delete user ${id}: ${error}`);
      return {
        success: false,
        message: 'Failed to delete user',
        error,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      message: 'User deleted successfully',
      data: result.data,
      timestamp: new Date().toISOString(),
    };
  }
}
