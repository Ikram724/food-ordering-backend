import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UserService } from "./auth.service";
import bcrypt from "bcrypt";
import { Restaurant } from "../entities/restaurant.entity";
import { getRepository } from "typeorm";

const userService = new UserService();

export class AuthController {
  async signup(req: Request, res: Response) {
    const { username, password } = req.body;
    const user = await userService.createUser(username, password);
    res.status(201).json(user);
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const user = await userService.findUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, "secret_key");
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  }
  async getAllRestaurants(req: Request, res: Response) {
    const allRestaurants = await getRepository(Restaurant).find();
    res.status(200).json(allRestaurants);
  }

  async getResById(req: Request, res: Response) {
    res.send(`restaurant by id ${req.params.id}`);
  }
  async createRestaurant(req: Request, res: Response) {
    const restaurantRepository = getRepository(Restaurant);
    const newRestaurant = restaurantRepository.create(req.body);
    await restaurantRepository.save(newRestaurant);
    res.status(201).json(newRestaurant);
  }
  async updateRestaurant(req: Request, res: Response) {
    res.send(`restaurant updated of id: ${req.params.id}`);
  }
  async deleteRestaurant(req: Request, res: Response) {
    res.send(`restaurant deleted of id: ${req.params.id}`);
  }
}
