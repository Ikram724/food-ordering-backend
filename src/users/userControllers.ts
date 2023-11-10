import { Request, Response } from "express";

export class UserController {
  async showRestaurants(req: Request, res: Response) {
    res.send("list of all restaurants");
  }
  async showFoodItem(req: Request, res: Response) {
    res.send("list of all food items of specific restaurant");
  }
  async orderFooditem(req: Request, res: Response) {
    res.send("your order has been taken !you will be dilevered soon");
  }
}
