import { Injectable } from '@nestjs/common';
import { BaseMapper } from '../../../common/mappers';
import { PaymentMethodDomain } from '../domain/payment-method.domain';
import {
  CreatePaymentMethodDto,
  PaymentMethodResponseDto,
} from '../dto/payment-method.dto';
import { ConfigEntity } from '../../../common/entities/config.entity';

/**
 * PaymentMethod Mapper
 * Extends BaseMapper to provide domain-specific transformations
 * Converts between:
 * - Entity (TypeORM) ↔ Domain (Business Logic)
 * - ConfigEntity (Generic) ↔ Domain
 * - DTO (Request/Response) ↔ Domain
 */
@Injectable()
export class PaymentMethodMapper extends BaseMapper<
  ConfigEntity,
  PaymentMethodDomain,
  CreatePaymentMethodDto,
  PaymentMethodResponseDto
> {
  /**
   * Convert ConfigEntity → Domain (for GET operations using shared config table)
   */
  toDomainFromConfig(config: ConfigEntity): PaymentMethodDomain {
    return new PaymentMethodDomain({
      id: config.id,
      code: config.configName,
      displayName: config.displayName || '',
      active: config.active,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
      createdBy: config.createdBy,
      updatedBy: config.updatedBy,
    });
  }

  /**
   * Implement abstract toDomain method (wraps toDomainFromConfig)
   */
  toDomain(entity: ConfigEntity): PaymentMethodDomain {
    return this.toDomainFromConfig(entity);
  }

  /**
   * Implement abstract toPersistence method (wraps toConfigEntity)
   */
  toPersistence(domain: PaymentMethodDomain): ConfigEntity {
    return this.toConfigEntity(domain);
  }

  /**
   * Convert Domain → ConfigEntity (for saving to shared config table)
   */
  toConfigEntity(domain: PaymentMethodDomain): ConfigEntity {
    return {
      id: domain.id,
      configType: 'PAYMENT_METHOD',
      configName: domain.code,
      displayName: domain.displayName,
      displayNameEn: null,
      value1: null,
      value2: null,
      value3: null,
      active: domain.active,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      createdBy: domain.createdBy,
      updatedBy: domain.updatedBy,
    } as ConfigEntity;
  }

  /**
   * Convert DTO (Request) → Domain (for CREATE operations)
   */
  toDomainFromCreate(
    dto: CreatePaymentMethodDto,
  ): Partial<PaymentMethodDomain> {
    return {
      code: dto.code,
      displayName: dto.displayName,
      active: dto.active ?? true,
      createdBy: dto.createdBy ?? '',
      updatedBy: dto.updatedBy ?? '',
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
