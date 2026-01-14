import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodMapper } from './mapper/payment-method.mapper';
import { PaymentMethodRepository } from './repository/payment-method.repository';
import { PaymentMethodRepositoryImpl } from './repository/payment-method.repository.impl';
import { ConfigEntity } from '../../common/entities/config.entity';
import { ConfigRepositoryImpl } from '../../common/repositories/config.repository.impl';

/**
 * PaymentMethod Module
 * Manages payment method CRUD operations using shared ConfigEntity
 */
@Module({
  imports: [TypeOrmModule.forFeature([ConfigEntity])],
  controllers: [PaymentMethodController],
  providers: [
    PaymentMethodService,
    PaymentMethodMapper,
    ConfigRepositoryImpl,
    {
      provide: PaymentMethodRepository,
      useClass: PaymentMethodRepositoryImpl,
    },
  ],
  exports: [PaymentMethodService, PaymentMethodMapper],
})
export class PaymentMethodModule {}
