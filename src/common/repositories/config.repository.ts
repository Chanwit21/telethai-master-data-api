import { ConfigEntity } from '../entities/config.entity';

/**
 * Generic Config Repository Interface
 * Defines contract for config repository operations
 */
export interface IConfigRepository {
  create(data: Partial<ConfigEntity>): Promise<ConfigEntity>;
  findAll(configType: string): Promise<ConfigEntity[]>;
  findByName(
    configType: string,
    configName: string,
  ): Promise<ConfigEntity | null>;
  update(id: string, data: Partial<ConfigEntity>): Promise<ConfigEntity | null>;
  remove(id: string): Promise<boolean>;
}
