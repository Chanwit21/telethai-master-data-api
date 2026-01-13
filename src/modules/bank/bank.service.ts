import { Injectable, NotFoundException } from '@nestjs/common';
import { BankRepository } from './repository/bank.repository';
import { BankMapper } from './mapper/bank.mapper';
import { BankDomain } from './domain/bank.domain';
import { CreateBankDto, UpdateBankDto } from './dto/bank.dto';

/**
 * Bank Service
 * Orchestrates business logic for banks
 */
@Injectable()
export class BankService {
  constructor(
    private readonly repository: BankRepository,
    private readonly mapper: BankMapper,
  ) {}

  async create(data: CreateBankDto): Promise<BankDomain> {
    const createPayload = this.mapper.toDomainFromCreate(data);
    const createdDomain = await this.repository.create(
      createPayload as unknown as Omit<BankDomain, 'createdAt' | 'updatedAt'>,
    );
    return createdDomain;
  }

  async findAll(): Promise<BankDomain[]> {
    return this.repository.findAll();
  }

  async findByCode(code: string): Promise<BankDomain> {
    const domain = await this.repository.findByCode(code);
    if (!domain) {
      throw new NotFoundException(`Bank with code ${code} not found`);
    }
    return domain;
  }

  async update(code: string, data: UpdateBankDto): Promise<BankDomain> {
    const domain = await this.repository.update(code, data);
    if (!domain) {
      throw new NotFoundException(`Bank with code ${code} not found`);
    }
    return domain;
  }

  async remove(code: string): Promise<boolean> {
    const deleted = await this.repository.remove(code);
    if (!deleted) {
      throw new NotFoundException(`Bank with code ${code} not found`);
    }
    return deleted;
  }
}
