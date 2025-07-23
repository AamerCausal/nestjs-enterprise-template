import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    this.logger.log(`🔐 LOGIN ATTEMPT: ${loginDto.email}`);

    // Find user by email
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      this.logger.log(`❌ LOGIN FAILED: User not found - ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`👤 User found: ${user.email}, checking password...`);

    // Check password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    this.logger.log(`🔑 Password check result: ${isPasswordValid ? 'VALID' : 'INVALID'}`);

    if (!isPasswordValid) {
      this.logger.log(`❌ LOGIN FAILED: Invalid password for ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    this.logger.log(`✅ LOGIN SUCCESS: ${user.email}`);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    this.logger.log(`📝 REGISTER ATTEMPT: ${registerDto.email}`);

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      this.logger.log(`❌ REGISTER FAILED: User already exists - ${registerDto.email}`);
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    this.logger.log(`🔐 Password hashed for user: ${registerDto.email}`);

    // Create user
    const userResult = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    if (!userResult.success) {
      const error = (userResult as any).error;
      this.logger.error(`❌ REGISTER FAILED: ${error}`);
      throw new BadRequestException(error);
    }

    const user = userResult.data;

    // Generate token
    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    this.logger.log(`✅ REGISTER SUCCESS: ${user.email}`);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateUser(payload: any) {
    return this.usersService.findByEmail(payload.email);
  }
}
