import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BankResponseDto {
  @ApiProperty({
    description: 'Bank code',
    example: 'SCB',
  })
  @Expose()
  code: string;

  @ApiProperty({
    description: 'Bank name in Thai',
    example: 'ธนาคารไทยพาณิชย์',
  })
  @Expose()
  bankNameTh: string;

  @ApiProperty({
    description: 'Bank name in English',
    example: 'Siam Commercial Bank',
    required: false,
  })
  @Expose()
  bankNameEn: string | null;

  @ApiProperty({ description: 'Is active', example: true })
  @Expose()
  active: boolean;

  @ApiProperty({ description: 'Created timestamp' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'Created by user ID' })
  @Expose()
  createdBy: string;

  @ApiProperty({ description: 'Updated by user ID' })
  @Expose()
  updatedBy: string;
}

export class CreateBankDto {
  @ApiProperty({
    description: 'Bank code',
    example: 'SCB',
  })
  code: string;

  @ApiProperty({
    description: 'Bank name in Thai',
    example: 'ธนาคารไทยพาณิชย์',
  })
  bankNameTh: string;

  @ApiProperty({
    description: 'Bank name in English',
    example: 'Siam Commercial Bank',
    required: false,
  })
  bankNameEn?: string;

  @ApiProperty({ description: 'Is active', example: true, required: false })
  active?: boolean;

  @ApiProperty({ description: 'Created by user ID', required: false })
  createdBy?: string;

  @ApiProperty({ description: 'Updated by user ID', required: false })
  updatedBy?: string;
}

export class UpdateBankDto {
  @ApiProperty({
    description: 'Bank name in Thai',
    example: 'ธนาคารไทยพาณิชย์',
    required: false,
  })
  bankNameTh?: string;

  @ApiProperty({
    description: 'Bank name in English',
    example: 'Siam Commercial Bank',
    required: false,
  })
  bankNameEn?: string | null;

  @ApiProperty({ description: 'Is active', example: true, required: false })
  active?: boolean;
}
