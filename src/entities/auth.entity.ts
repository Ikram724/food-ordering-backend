import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Restaurant } from "./restaurant.entity";

@Entity()
export class Admin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany((_type) => Restaurant, (res) => res.admin, { eager: true })
  @JoinColumn()
  restaurant: Restaurant[];
}
