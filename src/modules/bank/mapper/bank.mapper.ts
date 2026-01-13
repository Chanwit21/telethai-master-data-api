import { Injectable } from '@nestjs/common';
import { BaseMapper } from '../../../common/mappers';
import { BankEntity } from '../entity/bank.entity';
import { BankDomain } from '../domain/bank.domain';
import { CreateBankDto, BankResponseDto } from '../dto/bank.dto';

/**
 * Bank Mapper
 * Extends BaseMapper to provide domain-specific transformations
 * Converts between:
 * - Entity (TypeORM) ↔ Domain (Business Logic)
 * - DTO (Request/Response) ↔ Domain
 */
@Injectable()
export class BankMapper extends BaseMapper<
  BankEntity,
  BankDomain,
  CreateBankDto,
  BankResponseDto
> {
  /**
   * Convert TypeORM Entity → Domain (for GET operations)
   */
  toDomain(entity: BankEntity): BankDomain {
    return new BankDomain({
      code: entity.code,
      bankNameTh: entity.bankNameTh,
      bankNameEn: entity.bankNameEn ?? null,
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
  toPersistence(domain: BankDomain): BankEntity {
    return {
      code: domain.code,
      bankNameTh: domain.bankNameTh,
      bankNameEn: domain.bankNameEn ?? null,
      active: domain.active,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      createdBy: domain.createdBy,
      updatedBy: domain.updatedBy,
    } as BankEntity;
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
