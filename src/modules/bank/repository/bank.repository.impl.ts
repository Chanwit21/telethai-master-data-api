import { Injectable, Logger } from '@nestjs/common';
import { BankRepository } from './bank.repository';
import { BankMapper } from '../mapper/bank.mapper';
import { BankDomain } from '../domain/bank.domain';
import { ConfigRepositoryImpl } from '../../../common/repositories/config.repository.impl';

/**
 * Bank Repository Implementation
 * Uses shared ConfigRepository for CRUD operations
 */
@Injectable()
export class BankRepositoryImpl extends BankRepository {
  private readonly logger = new Logger(BankRepositoryImpl.name);
  private readonly configType = 'BANK';

  constructor(
    private readonly configRepository: ConfigRepositoryImpl,
    private readonly mapper: BankMapper,
  ) {
    super();
  }

  async create(
    data: Omit<BankDomain, 'createdAt' | 'updatedAt'>,
  ): Promise<BankDomain> {
    this.logger.debug(`Creating Bank: ${data.code}`);

    try {
      const { v4: uuidv4 } = await import('uuid');
      const id = uuidv4();

      const configData = {
        id,
        configType: this.configType,
        configName: data.code,
        displayName: data.bankNameTh,
        displayNameEn: data.bankNameEn ?? null,
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
      this.logger.error(`Error creating Bank: ${err.message}`, err.stack);
      throw error;
    }
  }

  async findAll(): Promise<BankDomain[]> {
    this.logger.debug('Finding all Banks');

    const configs = await this.configRepository.findAll(this.configType);
    return configs.map((config) => this.mapper.toDomainFromConfig(config));
  }

  async findByCode(code: string): Promise<BankDomain | null> {
    this.logger.debug(`Finding Bank by code: ${code}`);

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
    code: string,
    data: Partial<Omit<BankDomain, 'code' | 'createdAt'>>,
  ): Promise<BankDomain | null> {
    this.logger.debug(`Updating Bank: ${code}`);

    // Find the config by code to get its ID
    const config = await this.configRepository.findByName(
      this.configType,
      code,
    );
    if (!config) {
      return null;
    }

    const updateData: Record<string, any> = {};
    if (data.bankNameTh !== undefined) updateData.displayName = data.bankNameTh;
    if (data.bankNameEn !== undefined)
      updateData.displayNameEn = data.bankNameEn;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy;

    // Update by the actual UUID ID
    const updated = await this.configRepository.update(config.id, updateData);

    if (!updated || updated.configType !== this.configType) {
      return null;
    }

    return this.mapper.toDomainFromConfig(updated);
  }

  async remove(code: string): Promise<boolean> {
    this.logger.debug(`Deleting Bank: ${code}`);

    // Find the config by code to get its ID
    const config = await this.configRepository.findByName(
      this.configType,
      code,
    );
    if (!config) {
      return false;
    }

    // Delete by the actual UUID ID
    return this.configRepository.remove(config.id);
  }
}
