/**
 * Bank Domain Model
 * Represents business logic for banks
 */
export class BankDomain {
  code: string;

  bankNameTh: string;

  bankNameEn: string | null;

  active: boolean;

  createdAt: Date;

  updatedAt: Date;

  createdBy: string;

  updatedBy: string;

  constructor(data: {
    code: string;
    bankNameTh: string;
    bankNameEn: string | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  }) {
    this.code = data.code;
    this.bankNameTh = data.bankNameTh;
    this.bankNameEn = data.bankNameEn;
    this.active = data.active;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdBy = data.createdBy;
    this.updatedBy = data.updatedBy;
  }
}
