import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  Restaurant_Name: string;

  @Column()
  Location: string;

  @Column()
  Food_items: string;
}
