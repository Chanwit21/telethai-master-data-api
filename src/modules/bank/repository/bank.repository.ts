import { Injectable } from '@nestjs/common';
import { BankDomain } from '../domain/bank.domain';

/**
 * Abstract Bank Repository
 * Defines contract for Bank data access
 */
@Injectable()
export abstract class BankRepository {
  abstract create(
    data: Omit<BankDomain, 'createdAt' | 'updatedAt'>,
  ): Promise<BankDomain>;

  abstract findAll(): Promise<BankDomain[]>;

  abstract findByCode(code: string): Promise<BankDomain | null>;

  abstract update(
    code: string,
    data: Partial<Omit<BankDomain, 'code' | 'createdAt'>>,
  ): Promise<BankDomain | null>;

  abstract remove(code: string): Promise<boolean>;
}
