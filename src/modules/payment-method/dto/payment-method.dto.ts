import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaymentMethodResponseDto {
  @ApiProperty({ description: 'Unique identifier', example: 'uuid-string' })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Payment method code',
    example: 'PROMPTPAY',
    enum: ['PROMPTPAY', 'BANK_TRANSFER', 'CARD', 'EWALLET'],
  })
  @Expose()
  code: string;

  @ApiProperty({ description: 'Payment method display name', example: 'PromptPay' })
  @Expose()
  displayName: string;

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

export class CreatePaymentMethodDto {
  @ApiProperty({
    description: 'Payment method code',
    example: 'PROMPTPAY',
    enum: ['PROMPTPAY', 'BANK_TRANSFER', 'CARD', 'EWALLET'],
  })
  code: string;

  @ApiProperty({ description: 'Payment method display name', example: 'PromptPay' })
  displayName: string;

  @ApiProperty({ description: 'Is active', example: true, required: false })
  active?: boolean;
}

export class UpdatePaymentMethodDto {
  @ApiProperty({
    description: 'Payment method display name',
    example: 'PromptPay',
    required: false,
  })
  displayName?: string;

  @ApiProperty({ description: 'Is active', example: true, required: false })
  active?: boolean;
}
