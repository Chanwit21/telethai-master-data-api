import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { BankMapper } from './mapper/bank.mapper';
import { BankRepository } from './repository/bank.repository';
import { BankRepositoryImpl } from './repository/bank.repository.impl';
import { ConfigEntity } from '../../common/entities/config.entity';
import { ConfigRepositoryImpl } from '../../common/repositories/config.repository.impl';

/**
 * Bank Module
 * Manages bank CRUD operations using shared ConfigEntity
 */
@Module({
  imports: [TypeOrmModule.forFeature([ConfigEntity])],
  controllers: [BankController],
  providers: [
    BankService,
    BankMapper,
    ConfigRepositoryImpl,
    {
      provide: BankRepository,
      useClass: BankRepositoryImpl,
    },
  ],
  exports: [BankService, BankMapper],
})
export class BankModule {}
