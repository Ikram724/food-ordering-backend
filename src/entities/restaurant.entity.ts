import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Food } from "./fooditem.entity";

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

  @OneToMany(() => Food, (food) => food.Item_Name)
  food: Food;
}
