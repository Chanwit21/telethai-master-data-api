/**
 * Generic Config Repository Interface
 * Defines contract for config repository operations
 */
export interface IConfigRepository {
  create(data: any): Promise<any>;
  findAll(configType: string): Promise<any[]>;
  findByName(configType: string, configName: string): Promise<any | null>;
  update(id: string, data: any): Promise<any | null>;
  remove(id: string): Promise<boolean>;
}
