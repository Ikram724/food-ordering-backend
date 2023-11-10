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
    const expirationTime = 60 * 60;
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user: { id: user.id } }, "secret_key", {
        expiresIn: expirationTime,
      });
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
    try {
      const restaurant = await getRepository(Restaurant).findOne(req.params.id);
      if (restaurant) {
        res.status(200).json(restaurant);
      } else {
        res.status(404).json({ message: "Restaurant not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async createRestaurant(req: Request, res: Response) {
    const restaurantRepository = getRepository(Restaurant);
    const newRestaurant = restaurantRepository.create(req.body);
    await restaurantRepository.save(newRestaurant);
    res.status(201).json(newRestaurant);
  }
  async updateRestaurant(req: Request, res: Response) {
    try {
      const restaurantRepository = getRepository(Restaurant);
      const existingRestaurant = await restaurantRepository.findOne(
        req.params.id
      );

      if (!existingRestaurant) {
        res.status(404).json({ message: "Restaurant not found" });
        return;
      }

      const updatedRestaurant = restaurantRepository.merge(
        existingRestaurant,
        req.body
      );
      await restaurantRepository.save(updatedRestaurant);
      res.status(200).json(updatedRestaurant);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async deleteRestaurant(req: Request, res: Response) {
    try {
      const restaurantRepository = getRepository(Restaurant);
      const deleteResult = await restaurantRepository.delete(req.params.id);

      if (deleteResult.affected !== undefined && deleteResult.affected) {
        res.status(204).end().send(`restaurant deleted`);
      } else {
        res.status(404).json({ message: "Restaurant not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
