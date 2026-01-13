import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Bank Entity
 * Database representation of bank
 */
@Entity('banks')
export class BankEntity {
  @PrimaryColumn('text')
  code: string;

  @Column('text')
  bankNameTh: string;

  @Column('text', { nullable: true })
  bankNameEn: string | null;

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
