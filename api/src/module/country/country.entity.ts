import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CityEntity } from './../city/city.entity';

export const CountryTableName = 'countries';

@Entity({
  name: CountryTableName,
})
export class CountryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true, // Ensure country names are unique
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  code: string;

  @OneToMany(() => CityEntity, (city) => city.country, {
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL', // CASCADE
  }) // One-to-many relationship with City
  cities: CityEntity[]; // A country can have multiple cities
}
