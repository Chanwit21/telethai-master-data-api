import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * PaymentMethod Entity
 * Database representation of payment method
 */
@Entity('payment_methods')
export class PaymentMethodEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  code: string;

  @Column('text')
  displayName: string;

  @Column('boolean', { default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('uuid')
  createdBy: string;

  @Column('uuid')
  updatedBy: string;
}
