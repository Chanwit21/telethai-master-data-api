/**
 * ProductBrand Domain Class
 * Contains business logic and validated data
 * This is the entity used within the service layer
 */
export class ProductBrandDomain {
  id: string;
  name: string;
  reference: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: string;
    name: string;
    reference: string;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.reference = props.reference;
    this.description = props.description;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Create new ProductBrand without ID (for creation)
   */
  static create(props: {
    name: string;
    reference: string;
    description?: string | null;
  }): {
    name: string;
    reference: string;
    description?: string | null;
  } {
    return {
      name: props.name,
      reference: props.reference,
      description: props.description,
    };
  }

  /**
   * Get product brand summary
   */
  getSummary(): string {
    return `${this.name} (${this.reference})`;
  }
}
