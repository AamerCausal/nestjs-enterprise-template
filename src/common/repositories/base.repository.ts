import { Injectable } from '@nestjs/common';
import { Repository, FindManyOptions, DeepPartial } from 'typeorm';
import { IBaseRepository, PaginatedResult } from '../interfaces/repository.interface';

@Injectable()
export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findById(id: number): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async create(entity: Partial<T>): Promise<T> {
    const newEntity = this.repository.create(entity as DeepPartial<T>);
    return this.repository.save(newEntity);
  }

  async update(id: number, entity: Partial<T>): Promise<T> {
    await this.repository.update(id, entity as any);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async findWithPagination(page: number, limit: number): Promise<PaginatedResult<T>> {
    const [items, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }
}