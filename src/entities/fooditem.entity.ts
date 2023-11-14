import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Restaurant } from "./restaurant.entity";

@Entity()
export class Food {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  Item_Name: string;

  @Column()
  item_Price: string;

  @ManyToOne(() => Restaurant, (res) => res.Food_items)
  res: Restaurant;
}
