/**
 * Generic Mapper Interface
 * Defines contract for all mappers across the application
 */
export interface IMapper<TEntity, TDomain, TCreateDto, TResponseDto> {
  /**
   * Convert Entity → Domain
   * Used when retrieving from database
   */
  toDomain(entity: TEntity): TDomain;

  /**
   * Convert multiple Entities → Domains
   * Used when retrieving lists from database
   */
  toDomains(entities: TEntity[]): TDomain[];

  /**
   * Convert CreateDto → Domain
   * Used when creating new entities from request
   */
  toDomainFromCreate(dto: TCreateDto): Partial<TDomain>;

  /**
   * Convert Domain → ResponseDto
   * Used when returning response to client
   */
  toDto(domain: TDomain): TResponseDto;

  /**
   * Convert multiple Domains → ResponseDtos
   * Used when returning list to client
   */
  toDtos(domains: TDomain[]): TResponseDto[];

  /**
   * Convert Domain → Entity
   * Used when persisting to database
   */
  toPersistence(domain: TDomain): TEntity;
}
