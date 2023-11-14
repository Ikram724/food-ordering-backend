import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Food } from "./fooditem.entity";
import { Admin } from "./auth.entity";

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
  food: Food[];

  @ManyToOne((_type) => Admin, (admin) => admin.restaurant)
  admin: Admin;
}
