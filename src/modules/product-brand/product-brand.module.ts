import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../database/database.module';
import { ProductBrandService } from './product-brand.service';
import { ProductBrandController } from './product-brand.controller';
import { ProductBrandEntity } from './entity/product-brand.entity';
import { ProductBrandMapper } from './mapper/product-brand.mapper';
import { ProductBrandRepository } from './repository/product-brand.repository';
import { ProductBrandRepositoryImpl } from './repository/product-brand.repository.impl';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([ProductBrandEntity])],
  controllers: [ProductBrandController],
  providers: [
    ProductBrandService,
    ProductBrandMapper,
    RolesGuard,
    {
      provide: ProductBrandRepository,
      useClass: ProductBrandRepositoryImpl,
    },
  ],
  exports: [ProductBrandService, ProductBrandRepository],
})
export class ProductBrandModule {}
