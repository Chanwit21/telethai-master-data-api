import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ProductBrandEntity } from '../entity/product-brand.entity';
import { ProductBrandRepository } from './product-brand.repository';
import { ProductBrandMapper } from '../mapper/product-brand.mapper';
import { ProductBrandDomain } from '../domain/product-brand.domain';

/**
 * ProductBrand Repository Implementation
 * Implements abstract repository with TypeORM
 */
@Injectable()
export class ProductBrandRepositoryImpl extends ProductBrandRepository {
  private readonly logger = new Logger(ProductBrandRepositoryImpl.name);

  constructor(
    @InjectRepository(ProductBrandEntity)
    private readonly typeormRepository: Repository<ProductBrandEntity>,
    private readonly mapper: ProductBrandMapper,
  ) {
    super();
  }

  /**
   * Create new ProductBrand
   */
  async create(
    data: Omit<ProductBrandDomain, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ProductBrandDomain> {
    this.logger.debug(`Creating ProductBrand: ${data.name}`);

    try {
      const savedEntity = await this.typeormRepository.save({
        name: data.name,
        reference: data.reference,
        description: data.description ?? null,
      } as unknown as ProductBrandEntity);

      return this.mapper.toDomain(savedEntity);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error creating ProductBrand: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Find all ProductBrands
   */
  async findAll(): Promise<ProductBrandDomain[]> {
    this.logger.debug('Finding all ProductBrands');

    const entities = await this.typeormRepository.find({
      order: { name: 'ASC' },
    });

    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  /**
   * Find ProductBrand by ID
   */
  async findById(id: string): Promise<ProductBrandDomain | null> {
    this.logger.debug(`Finding ProductBrand by id: ${id}`);

    const entity = await this.typeormRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return this.mapper.toDomain(entity);
  }

  /**
   * Find ProductBrand by reference
   */
  async findByReference(reference: string): Promise<ProductBrandDomain | null> {
    this.logger.debug(`Finding ProductBrand by reference: ${reference}`);

    const entity = await this.typeormRepository.findOne({
      where: { reference },
    });

    if (!entity) {
      return null;
    }

    return this.mapper.toDomain(entity);
  }

  /**
   * Find multiple ProductBrands by IDs
   */
  async findByIds(ids: string[]): Promise<ProductBrandDomain[]> {
    this.logger.debug(`Finding ProductBrands by ids: ${ids.join(',')}`);

    const entities = await this.typeormRepository.find({
      where: { id: In(ids) },
    });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  /**
   * Update ProductBrand
   */
  async update(
    id: string,
    payload: Partial<
      Omit<ProductBrandDomain, 'id' | 'createdAt' | 'updatedAt'>
    >,
  ): Promise<ProductBrandDomain | null> {
    this.logger.debug(`Updating ProductBrand: ${id}`);

    await this.typeormRepository.update(id, payload);
    return this.findById(id);
  }

  /**
   * Delete ProductBrand
   */
  async remove(id: string): Promise<void> {
    this.logger.debug(`Deleting ProductBrand: ${id}`);

    await this.typeormRepository.delete(id);
  }
}
