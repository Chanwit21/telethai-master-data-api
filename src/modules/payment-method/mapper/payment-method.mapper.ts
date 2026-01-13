import { Injectable } from '@nestjs/common';
import { BaseMapper } from '../../../common/mappers';
import { PaymentMethodEntity } from '../entity/payment-method.entity';
import { PaymentMethodDomain } from '../domain/payment-method.domain';
import {
  CreatePaymentMethodDto,
  PaymentMethodResponseDto,
} from '../dto/payment-method.dto';

/**
 * PaymentMethod Mapper
 * Extends BaseMapper to provide domain-specific transformations
 * Converts between:
 * - Entity (TypeORM) ↔ Domain (Business Logic)
 * - DTO (Request/Response) ↔ Domain
 */
@Injectable()
export class PaymentMethodMapper extends BaseMapper<
  PaymentMethodEntity,
  PaymentMethodDomain,
  CreatePaymentMethodDto,
  PaymentMethodResponseDto
> {
  /**
   * Convert TypeORM Entity → Domain (for GET operations)
   */
  toDomain(entity: PaymentMethodEntity): PaymentMethodDomain {
    return new PaymentMethodDomain({
      id: entity.id,
      code: entity.code,
      displayName: entity.displayName,
      active: entity.active,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    });
  }

  /**
   * Convert Domain → Entity (for database persistence)
   */
  toPersistence(domain: PaymentMethodDomain): PaymentMethodEntity {
    return {
      id: domain.id,
      code: domain.code,
      displayName: domain.displayName,
      active: domain.active,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      createdBy: domain.createdBy,
      updatedBy: domain.updatedBy,
    } as PaymentMethodEntity;
  }

  /**
   * Convert DTO (Request) → Domain (for CREATE operations)
   */
  toDomainFromCreate(dto: CreatePaymentMethodDto): Partial<PaymentMethodDomain> {
    return {
      code: dto.code,
      displayName: dto.displayName,
      active: dto.active ?? true,
    };
  }

  /**
   * Convert Domain → DTO (Response)
   */
  toDto(domain: PaymentMethodDomain): PaymentMethodResponseDto {
    return {
      id: domain.id,
      code: domain.code,
      displayName: domain.displayName,
      active: domain.active,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      createdBy: domain.createdBy,
      updatedBy: domain.updatedBy,
    };
  }
}
