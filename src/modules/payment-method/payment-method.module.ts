import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodMapper } from './mapper/payment-method.mapper';
import { PaymentMethodEntity } from './entity/payment-method.entity';
import { PaymentMethodRepository } from './repository/payment-method.repository';
import { PaymentMethodRepositoryImpl } from './repository/payment-method.repository.impl';

/**
 * PaymentMethod Module
 * Manages payment method CRUD operations
 */
@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethodEntity])],
  controllers: [PaymentMethodController],
  providers: [
    PaymentMethodService,
    PaymentMethodMapper,
    {
      provide: PaymentMethodRepository,
      useClass: PaymentMethodRepositoryImpl,
    },
  ],
  exports: [PaymentMethodService, PaymentMethodMapper],
})
export class PaymentMethodModule {}
