import { Injectable, Logger } from '@nestjs/common';
import { PaymentMethodRepository } from './payment-method.repository';
import { PaymentMethodMapper } from '../mapper/payment-method.mapper';
import { PaymentMethodDomain } from '../domain/payment-method.domain';
import { ConfigRepositoryImpl } from '../../../common/repositories/config.repository.impl';

/**
 * PaymentMethod Repository Implementation
 * Uses shared ConfigRepository for CRUD operations
 */
@Injectable()
export class PaymentMethodRepositoryImpl extends PaymentMethodRepository {
  private readonly logger = new Logger(PaymentMethodRepositoryImpl.name);
  private readonly configType = 'PAYMENT_METHOD';

  constructor(
    private readonly configRepository: ConfigRepositoryImpl,
    private readonly mapper: PaymentMethodMapper,
  ) {
    super();
  }

  async create(
    data: Omit<PaymentMethodDomain, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PaymentMethodDomain> {
    this.logger.debug(`Creating PaymentMethod: ${data.code}`);

    try {
      const { v4: uuidv4 } = await import('uuid');
      const id = uuidv4();

      const configData = {
        id,
        configType: this.configType,
        configName: data.code,
        displayName: data.displayName,
        displayNameEn: null,
        value1: null,
        value2: null,
        value3: null,
        active: data.active ?? true,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
      };

      const savedConfig = await this.configRepository.create(configData);
      return this.mapper.toDomainFromConfig(savedConfig);
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

    const configs = await this.configRepository.findAll(this.configType);
    return configs.map((config) => this.mapper.toDomainFromConfig(config));
  }

  async findById(id: string): Promise<PaymentMethodDomain | null> {
    this.logger.debug(`Finding PaymentMethod by id: ${id}`);

    const config = await this.configRepository.findById(id);

    if (!config || config.configType !== this.configType) {
      return null;
    }

    return this.mapper.toDomainFromConfig(config);
  }

  async findByCode(code: string): Promise<PaymentMethodDomain | null> {
    this.logger.debug(`Finding PaymentMethod by code: ${code}`);

    const config = await this.configRepository.findByName(
      this.configType,
      code,
    );

    if (!config) {
      return null;
    }

    return this.mapper.toDomainFromConfig(config);
  }

  async update(
    id: string,
    data: Partial<Omit<PaymentMethodDomain, 'id' | 'createdAt'>>,
  ): Promise<PaymentMethodDomain | null> {
    this.logger.debug(`Updating PaymentMethod: ${id}`);

    const updateData: Record<string, any> = {};
    if (data.displayName !== undefined) updateData.displayName = data.displayName;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy;

    const updated = await this.configRepository.update(id, updateData);

    if (!updated || updated.configType !== this.configType) {
      return null;
    }

    return this.mapper.toDomainFromConfig(updated);
  }

  async remove(id: string): Promise<boolean> {
    this.logger.debug(`Deleting PaymentMethod: ${id}`);
    return this.configRepository.remove(id);
  }
}
