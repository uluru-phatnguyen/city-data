import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  RelationId,
  Unique,
} from 'typeorm';
import { CountryEntity } from './../country/country.entity';

export const CityTableName = 'cities';

@Entity({
  name: CityTableName,
})
@Unique(['countryId', 'name'])
@Unique(['countryId', 'code'])
export class CityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  code: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  population: number;

  @ManyToOne(() => CountryEntity, (country) => country.cities, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  country: CountryEntity;

  @Index()
  @RelationId((city: CityEntity) => city.country)
  @Column({
    type: 'integer',
    nullable: true,
  })
  countryId?: number;
}
