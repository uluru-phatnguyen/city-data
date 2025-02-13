import {
  // IsBoolean,
  IsNumber,
} from 'class-validator';
import {
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  // DeleteDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Convertor } from './../helper';

export interface IAuditUser {
  id?: number;
  name?: string;
}

@Exclude()
export abstract class BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  @IsNumber()
  id!: number;

  @Expose()
  @CreateDateColumn({
    transformer: Convertor.transformerDate,
  })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({
    transformer: Convertor.transformerDate,
  })
  updatedAt: Date;

  // @Expose()
  // @DeleteDateColumn({
  //   transformer: Convertor.transformerDate,
  // })
  // deletedAt?: Date;

  // @Expose()
  // @IsBoolean()
  // isActive?: boolean;

  @Expose()
  @Column({ type: 'json', nullable: true })
  createdBy!: IAuditUser;

  @Expose()
  @Column({ type: 'json', nullable: true })
  updatedBy!: IAuditUser;

  @BeforeUpdate()
  protected generateDateBeforeUpdate(): void {
    this.updatedAt = new Date();
  }
}
