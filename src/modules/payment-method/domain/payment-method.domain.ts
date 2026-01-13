/**
 * PaymentMethod Domain Model
 * Represents business logic for payment methods
 */
export class PaymentMethodDomain {
  id: string;

  code: string;

  displayName: string;

  active: boolean;

  createdAt: Date;

  updatedAt: Date;

  createdBy: string;

  updatedBy: string;

  constructor(data: {
    id: string;
    code: string;
    displayName: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  }) {
    this.id = data.id;
    this.code = data.code;
    this.displayName = data.displayName;
    this.active = data.active;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdBy = data.createdBy;
    this.updatedBy = data.updatedBy;
  }
}
