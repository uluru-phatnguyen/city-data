import { Entity, Column, ManyToOne, RelationId, Index, Unique } from 'typeorm';
import { BaseEntity } from './../../common/database/base.entity';
import { CityEntity } from './../city/city.entity';

export const ElectricityTableName = 'electricities';

@Entity({
  name: ElectricityTableName,
})
@Unique(['cityId', 'provider', 'dateRecorded'])
export class ElectricityEntity extends BaseEntity {
  @Column({
    type: 'varchar',
  })
  provider: string;

  @Column({
    type: 'float',
  })
  consumption: number;

  @Column({
    type: 'float',
  })
  outages: number;

  @Column({
    type: 'float',
  })
  renewablePercentage: number;

  @Column({
    type: 'date',
  })
  dateRecorded: Date;

  @Column({
    type: 'varchar',
    default: 'manual' /* api */,
  })
  source: string;

  @ManyToOne(() => CityEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  city: CityEntity;

  @Index()
  @RelationId((e: ElectricityEntity) => e.city)
  @Column({
    type: 'integer',
    nullable: true,
  })
  cityId?: number;
}
