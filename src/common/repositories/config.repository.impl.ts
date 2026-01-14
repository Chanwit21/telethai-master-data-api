import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigEntity } from '../entities/config.entity';
import { IConfigRepository } from './config.repository';

/**
 * Generic Config Repository Implementation
 * Provides CRUD operations for configuration data
 */
@Injectable()
export class ConfigRepositoryImpl implements IConfigRepository {
  private readonly logger = new Logger(ConfigRepositoryImpl.name);

  constructor(
    @InjectRepository(ConfigEntity)
    private readonly typeormRepository: Repository<ConfigEntity>,
  ) {}

  async create(data: {
    id: string;
    configType: string;
    configName: string;
    displayName?: string | null;
    displayNameEn?: string | null;
    value1?: string | null;
    value2?: string | null;
    value3?: string | null;
    active?: boolean;
    createdBy: string;
    updatedBy: string;
  }): Promise<ConfigEntity> {
    this.logger.debug(`Creating config: ${data.configType}/${data.configName}`);

    try {
      const savedEntity = await this.typeormRepository.save({
        id: data.id,
        configType: data.configType,
        configName: data.configName,
        displayName: data.displayName ?? null,
        displayNameEn: data.displayNameEn ?? null,
        value1: data.value1 ?? null,
        value2: data.value2 ?? null,
        value3: data.value3 ?? null,
        active: data.active ?? true,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
      });

      return savedEntity;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error creating config: ${err.message}`, err.stack);
      throw error;
    }
  }

  async findAll(configType: string): Promise<ConfigEntity[]> {
    this.logger.debug(`Finding all configs of type: ${configType}`);

    const entities = await this.typeormRepository.find({
      where: { configType },
      order: { configName: 'ASC' },
    });

    return entities;
  }

  async findByName(
    configType: string,
    configName: string,
  ): Promise<ConfigEntity | null> {
    this.logger.debug(`Finding config: ${configType}/${configName}`);

    const entity = await this.typeormRepository.findOne({
      where: { configType, configName },
    });

    if (!entity) {
      return null;
    }

    return entity;
  }

  async findById(id: string): Promise<ConfigEntity | null> {
    this.logger.debug(`Finding config by id: ${id}`);

    const entity = await this.typeormRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return entity;
  }

  async update(
    id: string,
    data: Partial<{
      displayName: string;
      displayNameEn: string;
      value1: string;
      value2: string;
      value3: string;
      active: boolean;
      updatedBy: string;
    }>,
  ): Promise<ConfigEntity | null> {
    this.logger.debug(`Updating config: ${id}`);

    const existing = await this.typeormRepository.findOne({
      where: { id },
    });

    if (!existing) {
      return null;
    }

    const updateData: Record<string, any> = {};
    if (data.displayName !== undefined)
      updateData.displayName = data.displayName;
    if (data.displayNameEn !== undefined)
      updateData.displayNameEn = data.displayNameEn;
    if (data.value1 !== undefined) updateData.value1 = data.value1;
    if (data.value2 !== undefined) updateData.value2 = data.value2;
    if (data.value3 !== undefined) updateData.value3 = data.value3;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy;

    await this.typeormRepository.update({ id }, updateData);

    const updated = await this.typeormRepository.findOne({
      where: { id },
    });

    return updated ?? null;
  }

  async remove(id: string): Promise<boolean> {
    this.logger.debug(`Deleting config: ${id}`);

    const result = await this.typeormRepository.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
