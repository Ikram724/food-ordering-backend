import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Restaurant } from "../entities/restaurant.entity";

export class UserController {
  async showRestaurants(req: Request, res: Response) {
    const allRestaurants = await getRepository(Restaurant).find();
    res.status(200).json(allRestaurants);
  }
  async showFoodItem(req: Request, res: Response) {
    try {
      const restaurantId = req.params.restaurantId;

      // Find the restaurant by ID
      const restaurant = await getRepository(Restaurant).findOne(restaurantId);
      // Load the associated food items;

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Extract and send the food items
      const foodItems = restaurant.Food_items || [];
      return res.json(foodItems);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async orderFooditem(req: Request, res: Response) {
    res.send("your order has been taken !you will be dilevered soon");
  }
}
