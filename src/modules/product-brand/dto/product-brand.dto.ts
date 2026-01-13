import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';

export class ProductBrandResponseDto {
  @ApiProperty({ description: 'Unique identifier', example: 'uuid-string' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Brand name', example: 'Samsung' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Brand reference code', example: 'SAMSUNG' })
  @Expose()
  reference: string;

  @ApiProperty({
    description: 'Brand description',
    example: 'Samsung Products',
    required: false,
  })
  @Expose({ groups: ['admin', 'user'] })
  description: string | null;

  @ApiProperty({ description: 'Created timestamp' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  @Expose({ groups: ['admin'] })
  updatedAt: Date;
}

export class CreateProductBrandDto {
  @ApiProperty({ description: 'Brand name', example: 'Samsung' })
  name: string;

  @ApiProperty({ description: 'Brand reference code', example: 'SAMSUNG' })
  reference: string;

  @ApiProperty({
    description: 'Brand description',
    example: 'Samsung Products',
    required: false,
  })
  description?: string;
}

export class UpdateProductBrandDto {
  @ApiProperty({
    description: 'Brand name',
    example: 'Samsung',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Brand reference code',
    example: 'SAMSUNG',
    required: false,
  })
  reference?: string;

  @ApiProperty({
    description: 'Brand description',
    example: 'Samsung Products',
    required: false,
  })
  description?: string | null;
}
