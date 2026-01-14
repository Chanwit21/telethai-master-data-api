import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentMethodRepository } from './repository/payment-method.repository';
import { PaymentMethodMapper } from './mapper/payment-method.mapper';
import { PaymentMethodDomain } from './domain/payment-method.domain';
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from './dto/payment-method.dto';

/**
 * PaymentMethod Service
 * Orchestrates business logic for payment methods
 */
@Injectable()
export class PaymentMethodService {
  constructor(
    private readonly repository: PaymentMethodRepository,
    private readonly mapper: PaymentMethodMapper,
  ) {}

  async create(data: CreatePaymentMethodDto): Promise<PaymentMethodDomain> {
    const createPayload = this.mapper.toDomainFromCreate(data);
    const createdDomain = await this.repository.create(
      createPayload as unknown as Omit<
        PaymentMethodDomain,
        'id' | 'createdAt' | 'updatedAt'
      >,
    );
    return createdDomain;
  }

  async findAll(): Promise<PaymentMethodDomain[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<PaymentMethodDomain> {
    const domain = await this.repository.findById(id);
    if (!domain) {
      throw new NotFoundException(`PaymentMethod with id ${id} not found`);
    }
    return domain;
  }

  async findByCode(code: string): Promise<PaymentMethodDomain> {
    const domain = await this.repository.findByCode(code);
    if (!domain) {
      throw new NotFoundException(`PaymentMethod with code ${code} not found`);
    }
    return domain;
  }

  async update(
    id: string,
    data: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodDomain> {
    const domain = await this.repository.update(id, data);
    if (!domain) {
      throw new NotFoundException(`PaymentMethod with id ${id} not found`);
    }
    return domain;
  }

  async remove(id: string): Promise<boolean> {
    const deleted = await this.repository.remove(id);
    if (!deleted) {
      throw new NotFoundException(`PaymentMethod with id ${id} not found`);
    }
    return deleted;
  }
}
