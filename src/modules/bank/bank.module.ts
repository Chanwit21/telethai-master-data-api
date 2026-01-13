import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { BankMapper } from './mapper/bank.mapper';
import { BankEntity } from './entity/bank.entity';
import { BankRepository } from './repository/bank.repository';
import { BankRepositoryImpl } from './repository/bank.repository.impl';

/**
 * Bank Module
 * Manages bank CRUD operations
 */
@Module({
  imports: [TypeOrmModule.forFeature([BankEntity])],
  controllers: [BankController],
  providers: [
    BankService,
    BankMapper,
    {
      provide: BankRepository,
      useClass: BankRepositoryImpl,
    },
  ],
  exports: [BankService, BankMapper],
})
export class BankModule {}
