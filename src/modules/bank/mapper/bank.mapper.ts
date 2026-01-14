import { Injectable } from '@nestjs/common';
import { BaseMapper } from '../../../common/mappers';
import { BankDomain } from '../domain/bank.domain';
import { CreateBankDto, BankResponseDto } from '../dto/bank.dto';
import { ConfigEntity } from '../../../common/entities/config.entity';

/**
 * Bank Mapper
 * Extends BaseMapper to provide domain-specific transformations
 * Converts between:
 * - Entity (TypeORM) ↔ Domain (Business Logic)
 * - ConfigEntity (Generic) ↔ Domain
 * - DTO (Request/Response) ↔ Domain
 */
@Injectable()
export class BankMapper extends BaseMapper<
  ConfigEntity,
  BankDomain,
  CreateBankDto,
  BankResponseDto
> {
  /**
   * Convert ConfigEntity → Domain (for GET operations using shared config table)
   */
  toDomainFromConfig(config: ConfigEntity): BankDomain {
    return new BankDomain({
      code: config.configName,
      bankNameTh: config.displayName || '',
      bankNameEn: config.displayNameEn ?? null,
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
  toDomain(entity: ConfigEntity): BankDomain {
    return this.toDomainFromConfig(entity);
  }

  /**
   * Implement abstract toPersistence method (wraps toConfigEntity)
   */
  toPersistence(domain: BankDomain): ConfigEntity {
    return this.toConfigEntity(domain);
  }

  /**
   * Convert Domain → ConfigEntity (for saving to shared config table)
   */
  toConfigEntity(domain: BankDomain): ConfigEntity {
    return {
      id: domain.code, // Using code as ID for banks (unique identifier)
      configType: 'BANK',
      configName: domain.code,
      displayName: domain.bankNameTh,
      displayNameEn: domain.bankNameEn ?? null,
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
  toDomainFromCreate(dto: CreateBankDto): Partial<BankDomain> {
    return {
      code: dto.code,
      bankNameTh: dto.bankNameTh,
      bankNameEn: dto.bankNameEn ?? null,
      active: dto.active ?? true,
      createdBy: dto.createdBy ?? '',
      updatedBy: dto.updatedBy ?? '',
    };
  }

  /**
   * Convert Domain → DTO (Response)
   */
  toDto(domain: BankDomain): BankResponseDto {
    return {
      code: domain.code,
      bankNameTh: domain.bankNameTh,
      bankNameEn: domain.bankNameEn,
      active: domain.active,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      createdBy: domain.createdBy,
      updatedBy: domain.updatedBy,
    };
  }
}
