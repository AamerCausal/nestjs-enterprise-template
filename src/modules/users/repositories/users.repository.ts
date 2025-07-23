import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { User } from '../entities/user.entity';
import { UserRole } from '../../../common/enums/user-role.enum';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.repository.find({ where: { isActive: true } });
  }

  async getUsersWithRoles(role: UserRole): Promise<User[]> {
    return this.repository.find({
      where: { role },
      relations: ['profile']
    });
  }

  createQueryBuilder(alias?: string) {
    return this.repository.createQueryBuilder(alias);
  }
}