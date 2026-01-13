import { Injectable } from '@nestjs/common';
import { PaymentMethodDomain } from '../domain/payment-method.domain';

/**
 * Abstract PaymentMethod Repository
 * Defines contract for PaymentMethod data access
 */
@Injectable()
export abstract class PaymentMethodRepository {
  abstract create(
    data: Omit<PaymentMethodDomain, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PaymentMethodDomain>;

  abstract findAll(): Promise<PaymentMethodDomain[]>;

  abstract findById(id: string): Promise<PaymentMethodDomain | null>;

  abstract findByCode(code: string): Promise<PaymentMethodDomain | null>;

  abstract update(
    id: string,
    data: Partial<Omit<PaymentMethodDomain, 'id' | 'createdAt'>>,
  ): Promise<PaymentMethodDomain | null>;

  abstract remove(id: string): Promise<boolean>;
}
