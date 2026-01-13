import { Logger } from '@nestjs/common';
import { IMapper } from './mapper.interface';

/**
 * Abstract Base Mapper
 * Provides common mapping functionality for all entity mappers
 * Implements generic transformation methods with type safety
 *
 * Usage:
 * ```typescript
 * @Injectable()
 * export class ProductBrandMapper extends BaseMapper<
 *   ProductBrandEntity,
 *   ProductBrandDomain,
 *   CreateProductBrandDto,
 *   ProductBrandResponseDto
 * > {
 *   // Implement abstract methods only
 * }
 * ```
 */
export abstract class BaseMapper<
  TEntity,
  TDomain,
  TCreateDto,
  TResponseDto,
> implements IMapper<TEntity, TDomain, TCreateDto, TResponseDto> {
  protected readonly logger = new Logger(this.constructor.name);

  /**
   * Convert Entity → Domain
   * Abstract method - must be implemented by subclass
   */
  abstract toDomain(entity: TEntity): TDomain;

  /**
   * Convert CreateDto → Domain
   * Abstract method - must be implemented by subclass
   */
  abstract toDomainFromCreate(dto: TCreateDto): Partial<TDomain>;

  /**
   * Convert Domain → ResponseDto
   * Abstract method - must be implemented by subclass
   */
  abstract toDto(domain: TDomain): TResponseDto;

  /**
   * Convert Domain → Entity
   * Abstract method - must be implemented by subclass
   */
  abstract toPersistence(domain: TDomain): TEntity;

  /**
   * Convert multiple Entities → Domains
   * Default implementation - can be overridden if needed
   */
  toDomains(entities: TEntity[]): TDomain[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  /**
   * Convert multiple Domains → ResponseDtos
   * Default implementation - can be overridden if needed
   */
  toDtos(domains: TDomain[]): TResponseDto[] {
    return domains.map((domain) => this.toDto(domain));
  }
}
