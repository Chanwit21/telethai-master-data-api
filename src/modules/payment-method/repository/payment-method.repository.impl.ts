import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethodEntity } from '../entity/payment-method.entity';
import { PaymentMethodRepository } from './payment-method.repository';
import { PaymentMethodMapper } from '../mapper/payment-method.mapper';
import { PaymentMethodDomain } from '../domain/payment-method.domain';
import { v4 as uuidv4 } from 'uuid';

/**
 * PaymentMethod Repository Implementation
 * Implements abstract repository with TypeORM
 */
@Injectable()
export class PaymentMethodRepositoryImpl extends PaymentMethodRepository {
  private readonly logger = new Logger(PaymentMethodRepositoryImpl.name);

  constructor(
    @InjectRepository(PaymentMethodEntity)
    private readonly typeormRepository: Repository<PaymentMethodEntity>,
    private readonly mapper: PaymentMethodMapper,
  ) {
    super();
  }

  async create(
    data: Omit<PaymentMethodDomain, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PaymentMethodDomain> {
    this.logger.debug(`Creating PaymentMethod: ${data.code}`);

    try {
      const savedEntity = await this.typeormRepository.save({
        id: uuidv4(),
        code: data.code,
        displayName: data.displayName,
        active: data.active ?? true,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
      } as unknown as PaymentMethodEntity);

      return this.mapper.toDomain(savedEntity);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error creating PaymentMethod: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  async findAll(): Promise<PaymentMethodDomain[]> {
    this.logger.debug('Finding all PaymentMethods');

    const entities = await this.typeormRepository.find({
      order: { code: 'ASC' },
    });

    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async findById(id: string): Promise<PaymentMethodDomain | null> {
    this.logger.debug(`Finding PaymentMethod by id: ${id}`);

    const entity = await this.typeormRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return this.mapper.toDomain(entity);
  }

  async findByCode(code: string): Promise<PaymentMethodDomain | null> {
    this.logger.debug(`Finding PaymentMethod by code: ${code}`);

    const entity = await this.typeormRepository.findOne({
      where: { code },
    });

    if (!entity) {
      return null;
    }

    return this.mapper.toDomain(entity);
  }

  async update(
    id: string,
    data: Partial<Omit<PaymentMethodDomain, 'id' | 'createdAt'>>,
  ): Promise<PaymentMethodDomain | null> {
    this.logger.debug(`Updating PaymentMethod: ${id}`);

    const existing = await this.typeormRepository.findOne({
      where: { id },
    });

    if (!existing) {
      return null;
    }

    const updateData: Record<string, any> = {};
    if (data.displayName !== undefined) updateData.displayName = data.displayName;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy;

    await this.typeormRepository.update({ id }, updateData);

    const updated = await this.typeormRepository.findOne({
      where: { id },
    });

    return updated ? this.mapper.toDomain(updated) : null;
  }

  async remove(id: string): Promise<boolean> {
    this.logger.debug(`Deleting PaymentMethod: ${id}`);

    const result = await this.typeormRepository.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
