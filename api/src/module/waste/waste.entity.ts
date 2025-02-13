import { Entity, Column, ManyToOne, RelationId, Index, Unique } from 'typeorm';
import { BaseEntity } from './../../common/database/base.entity';
import { CityEntity } from './../city/city.entity';

export const WasteTableName = 'wastes';

@Entity({
  name: WasteTableName,
})
@Unique(['cityId', 'type', 'dateRecorded'])
export class WasteEntity extends BaseEntity {
  @Column({
    type: 'varchar',
  })
  type: string;

  @Column({
    type: 'float',
  })
  weight: number;

  @Column({
    type: 'date',
  })
  dateRecorded: Date;

  @Column({
    type: 'varchar',
    default: 'manual',
  })
  source: string;

  @ManyToOne(() => CityEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  city: CityEntity;

  @Index()
  @RelationId((w: WasteEntity) => w.city)
  @Column({
    type: 'integer',
    nullable: true,
  })
  cityId?: number;
}
