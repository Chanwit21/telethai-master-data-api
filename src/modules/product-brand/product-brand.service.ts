import { Injectable, Logger } from '@nestjs/common';
import { ProductBrandRepository } from './repository/product-brand.repository';
import { ProductBrandDomain } from './domain/product-brand.domain';
import { ProductBrandMapper } from './mapper/product-brand.mapper';
import {
  CreateProductBrandDto,
  UpdateProductBrandDto,
} from './dto/product-brand.dto';

@Injectable()
export class ProductBrandService {
  private readonly logger = new Logger(ProductBrandService.name);

  constructor(
    private readonly repository: ProductBrandRepository,
    private readonly mapper: ProductBrandMapper,
  ) {}

  /**
   * Create new ProductBrand
   * DTO → Domain → Repository → Entity → Database
   */
  async create(data: CreateProductBrandDto): Promise<ProductBrandDomain> {
    this.logger.log(`Creating ProductBrand: ${data.name}`);

    // Map DTO to create payload
    const createPayload = this.mapper.toDomainFromCreate(data);

    // Create in repository (which handles Domain → Entity mapping)
    const createdDomain = await this.repository.create(
      createPayload as unknown as Omit<
        ProductBrandDomain,
        'id' | 'createdAt' | 'updatedAt'
      >,
    );

    this.logger.log(`ProductBrand created with ID: ${createdDomain.id}`);
    return createdDomain;
  }

  /**
   * Get all ProductBrands
   */
  async findAll(): Promise<ProductBrandDomain[]> {
    this.logger.log('Getting all ProductBrands');
    return this.repository.findAll();
  }

  /**
   * Get ProductBrand by ID
   */
  async findById(id: string): Promise<ProductBrandDomain | null> {
    this.logger.log(`Getting ProductBrand by id: ${id}`);
    return this.repository.findById(id);
  }

  /**
   * Get ProductBrand by reference
   */
  async findByReference(reference: string): Promise<ProductBrandDomain | null> {
    this.logger.log(`Getting ProductBrand by reference: ${reference}`);
    return this.repository.findByReference(reference);
  }

  /**
   * Update ProductBrand
   * DTO → Domain → Repository → Entity → Database
   */
  async update(
    id: string,
    data: UpdateProductBrandDto,
  ): Promise<ProductBrandDomain | null> {
    this.logger.log(`Updating ProductBrand: ${id}`);

    // Map DTO to partial Domain
    const updateData: Partial<
      Omit<ProductBrandDomain, 'id' | 'createdAt' | 'updatedAt'>
    > = {
      ...(data.name && { name: data.name }),
      ...(data.reference && { reference: data.reference }),
      ...(data.description !== undefined && {
        description: data.description ?? undefined,
      }),
    };

    // Update in repository (which handles Domain → Entity mapping)
    const updatedDomain = await this.repository.update(id, updateData);

    if (updatedDomain) {
      this.logger.log(`ProductBrand updated: ${id}`);
    }
    return updatedDomain;
  }

  /**
   * Delete ProductBrand
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting ProductBrand: ${id}`);
    return this.repository.remove(id);
  }
}
