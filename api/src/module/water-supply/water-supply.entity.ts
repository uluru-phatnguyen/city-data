import { Entity, Column, ManyToOne, RelationId, Index, Unique } from 'typeorm';
import { BaseEntity } from './../../common/database/base.entity';
import { CityEntity } from './../city/city.entity';

export const WaterSupplyTableName = 'water-supplies';

@Entity({
  name: WaterSupplyTableName,
})
@Unique(['cityId', 'provider', 'dateRecorded'])
export class WaterSupplyEntity extends BaseEntity {
  @Column({
    type: 'varchar',
  })
  provider: string;

  @Column({
    type: 'int',
  })
  level: number;

  @Column({
    type: 'float',
    default: 0,
  })
  consumption: number;

  @Column({
    type: 'varchar',
  })
  quality: string;

  @Column({
    type: 'varchar',
    default: 'manual' /* api */,
  })
  source: string;

  @Column({
    type: 'date',
  })
  dateRecorded: Date;

  @ManyToOne(() => CityEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  city: CityEntity;

  @Index()
  @RelationId((ws: WaterSupplyEntity) => ws.city)
  @Column({
    type: 'integer',
    nullable: true,
  })
  cityId?: number;
}
