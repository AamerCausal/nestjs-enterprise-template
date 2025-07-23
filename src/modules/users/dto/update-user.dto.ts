import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class UpdateUserDto {
  @ApiProperty({ 
    example: 'John Doe Updated',
    description: 'User full name',
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({ 
    example: 'newemail@example.com',
    description: 'User email address',
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ 
    example: 'newpassword123',
    description: 'New password',
    minLength: 6,
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ 
    enum: UserRole,
    description: 'User role in the system',
    required: false
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ 
    example: true,
    description: 'Whether the user account is active',
    required: false
  })
  @IsOptional()
  isActive?: boolean;
}
