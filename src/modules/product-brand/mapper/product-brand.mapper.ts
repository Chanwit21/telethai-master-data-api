import { Injectable } from '@nestjs/common';
import { BaseMapper } from '../../../common/mappers';
import { ProductBrandEntity } from '../entity/product-brand.entity';
import { ProductBrandDomain } from '../domain/product-brand.domain';
import {
  CreateProductBrandDto,
  ProductBrandResponseDto,
} from '../dto/product-brand.dto';

/**
 * ProductBrand Mapper
 * Extends BaseMapper to provide domain-specific transformations
 * Converts between:
 * - Entity (TypeORM) ↔ Domain (Business Logic)
 * - DTO (Request/Response) ↔ Domain
 */
@Injectable()
export class ProductBrandMapper extends BaseMapper<
  ProductBrandEntity,
  ProductBrandDomain,
  CreateProductBrandDto,
  ProductBrandResponseDto
> {
  /**
   * Convert TypeORM Entity → Domain (for GET operations)
   * Database representation → Business logic
   */
  toDomain(entity: ProductBrandEntity): ProductBrandDomain {
    return new ProductBrandDomain({
      id: entity.id,
      name: entity.name,
      reference: entity.reference,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  /**
   * Convert Domain → Entity (for database persistence)
   * Business logic → Database representation
   */
  toPersistence(domain: ProductBrandDomain): ProductBrandEntity {
    return {
      id: domain.id,
      name: domain.name,
      reference: domain.reference,
      description: domain.description ?? null,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    } as ProductBrandEntity;
  }

  /**
   * Convert DTO (Request) → Domain (for CREATE operations)
   * Incoming request data → Business logic
   */
  toDomainFromCreate(dto: CreateProductBrandDto): Partial<ProductBrandDomain> {
    return {
      name: dto.name,
      reference: dto.reference,
      description: dto.description ?? null,
    };
  }

  /**
   * Convert Domain → DTO (Response)
   * Business logic → Outgoing response
   */
  toDto(domain: ProductBrandDomain): ProductBrandResponseDto {
    return {
      id: domain.id,
      name: domain.name,
      reference: domain.reference,
      description: domain.description ?? null,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
