import { IsOptional, IsEnum, IsBoolean, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryDto } from '../../../common/dto/base.dto';
import { UserRole } from '../../../common/enums/user-role.enum';

export class GetUsersDto extends BaseQueryDto {
  @IsOptional()
  @IsEnum(UserRole)
  @ApiPropertyOptional({ enum: UserRole, description: 'Filter by user role' })
  role?: UserRole;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Filter by active status' })
  isActive?: boolean;

  @IsOptional()
  @IsIn(['name', 'email', 'createdAt'])
  @ApiPropertyOptional({
    enum: ['name', 'email', 'createdAt'],
    description: 'Field to sort by',
    default: 'createdAt'
  })
  sortBy?: string = 'createdAt';
}