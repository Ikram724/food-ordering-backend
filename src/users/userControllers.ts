import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Restaurant } from "../entities/restaurant.entity";
import { AppDataSource } from "../..";
import { Order } from "../entities/order.entity";

export class UserController {
  async showRestaurants(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Restaurant);
    const allRestaurants = await repo.find();
    res.json(allRestaurants);
  }
  async showFoodItem(req: Request, res: Response) {
    const id = req.params.id;
    const user = await AppDataSource.getRepository(Restaurant).findOne({
      where: { id },
    });
    const items = user?.Food_items;
    res.json(items);
  }
  async orderFooditem(req: Request, res: Response) {
    const { resName, Loc, Item } = req.body;
    if (!resName && !Loc && !Item) {
      res.json("all the fields are mandatory");
    }
    const repo = AppDataSource.getRepository(Order);
    await repo.save(req.body);
    res.send("your order has been taken !you will be dilevered soon");
  }
}
