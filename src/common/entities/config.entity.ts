import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * Generic Config Entity
 * Database representation for storing configuration data
 * Used for CRUD operations on multiple config types (PAYMENT_METHOD, BANK, etc.)
 */
@Entity('configs')
@Index(['configType', 'configName'])
export class ConfigEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  configType: string; // e.g., 'PAYMENT_METHOD', 'BANK'

  @Column('text')
  configName: string; // e.g., payment method code, bank code

  @Column('text', { nullable: true })
  displayName: string | null; // e.g., payment method display name, bank name Thai

  @Column('text', { nullable: true })
  displayNameEn: string | null; // e.g., bank name English

  @Column('text', { nullable: true })
  value1: string | null; // flexible field for additional data

  @Column('text', { nullable: true })
  value2: string | null; // flexible field for additional data

  @Column('text', { nullable: true })
  value3: string | null; // flexible field for additional data

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
