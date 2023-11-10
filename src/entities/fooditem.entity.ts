import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Food {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  Item_Name: string;

  @Column()
  item_Price: string;
}
