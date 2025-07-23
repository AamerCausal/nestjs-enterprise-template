import { FindManyOptions } from 'typeorm';

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface IBaseRepository<T> {
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(entity: Partial<T>): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T>;
  delete(id: number): Promise<boolean>;
  findWithPagination(page: number, limit: number): Promise<PaginatedResult<T>>;
}