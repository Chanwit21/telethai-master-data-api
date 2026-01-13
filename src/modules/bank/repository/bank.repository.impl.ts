import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankEntity } from '../entity/bank.entity';
import { BankRepository } from './bank.repository';
import { BankMapper } from '../mapper/bank.mapper';
import { BankDomain } from '../domain/bank.domain';

/**
 * Bank Repository Implementation
 * Implements abstract repository with TypeORM
 */
@Injectable()
export class BankRepositoryImpl extends BankRepository {
  private readonly logger = new Logger(BankRepositoryImpl.name);

  constructor(
    @InjectRepository(BankEntity)
    private readonly typeormRepository: Repository<BankEntity>,
    private readonly mapper: BankMapper,
  ) {
    super();
  }

  async create(data: Omit<BankDomain, 'createdAt' | 'updatedAt'>): Promise<BankDomain> {
    this.logger.debug(`Creating Bank: ${data.code}`);

    try {
      const savedEntity = await this.typeormRepository.save({
        code: data.code,
        bankNameTh: data.bankNameTh,
        bankNameEn: data.bankNameEn ?? null,
        active: data.active ?? true,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
      } as unknown as BankEntity);

      return this.mapper.toDomain(savedEntity);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error creating Bank: ${err.message}`, err.stack);
      throw error;
    }
  }

  async findAll(): Promise<BankDomain[]> {
    this.logger.debug('Finding all Banks');

    const entities = await this.typeormRepository.find({
      order: { code: 'ASC' },
    });

    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async findByCode(code: string): Promise<BankDomain | null> {
    this.logger.debug(`Finding Bank by code: ${code}`);

    const entity = await this.typeormRepository.findOne({
      where: { code },
    });

    if (!entity) {
      return null;
    }

    return this.mapper.toDomain(entity);
  }

  async update(
    code: string,
    data: Partial<Omit<BankDomain, 'code' | 'createdAt'>>,
  ): Promise<BankDomain | null> {
    this.logger.debug(`Updating Bank: ${code}`);

    const existing = await this.typeormRepository.findOne({
      where: { code },
    });

    if (!existing) {
      return null;
    }

    const updateData: Record<string, any> = {};
    if (data.bankNameTh !== undefined) updateData.bankNameTh = data.bankNameTh;
    if (data.bankNameEn !== undefined) updateData.bankNameEn = data.bankNameEn;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy;

    await this.typeormRepository.update({ code }, updateData);

    const updated = await this.typeormRepository.findOne({
      where: { code },
    });

    return updated ? this.mapper.toDomain(updated) : null;
  }

  async remove(code: string): Promise<boolean> {
    this.logger.debug(`Deleting Bank: ${code}`);

    const result = await this.typeormRepository.delete({ code });
    return (result.affected ?? 0) > 0;
  }
}
