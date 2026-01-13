import { ProductBrandDomain } from '../domain/product-brand.domain';

/**
 * Abstract ProductBrand Repository
 * Defines all CRUD methods and contracts for data access
 */
export abstract class ProductBrandRepository {
  /**
   * Create new ProductBrand
   */
  abstract create(
    data: Omit<ProductBrandDomain, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ProductBrandDomain>;

  /**
   * Find all ProductBrands
   */
  abstract findAll(): Promise<ProductBrandDomain[]>;

  /**
   * Find ProductBrand by ID
   */
  abstract findById(id: string): Promise<ProductBrandDomain | null>;

  /**
   * Find ProductBrand by reference
   */
  abstract findByReference(
    reference: string,
  ): Promise<ProductBrandDomain | null>;

  /**
   * Find multiple ProductBrands by IDs
   */
  abstract findByIds(ids: string[]): Promise<ProductBrandDomain[]>;

  /**
   * Update ProductBrand
   */
  abstract update(
    id: string,
    payload: Partial<
      Omit<ProductBrandDomain, 'id' | 'createdAt' | 'updatedAt'>
    >,
  ): Promise<ProductBrandDomain | null>;

  /**
   * Delete ProductBrand
   */
  abstract remove(id: string): Promise<void>;
}
