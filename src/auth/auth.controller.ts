import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UserService } from "./auth.service";
import bcrypt from "bcrypt";
import { Restaurant } from "../entities/restaurant.entity";
import { getRepository } from "typeorm";
import { Admin } from "../entities/auth.entity";
import { AppDataSource } from "../..";

interface AuthenticatedRequest extends Request {
  admin?: any; // Adjust the type based on your decoded token structure
}

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
    const repo = AppDataSource.getRepository(Restaurant);
    const allRestaurants = await repo.find();
    res.json(allRestaurants);
  }

  async getResById(req: Request, res: Response) {
    try {
      const resId = req.params.id;
      const repo = AppDataSource.getRepository(Restaurant);
      const resById = await repo.findBy({ id: resId });
      if (resById) {
        res.json(resById);
      } else {
        throw new Error("Restaurant not found");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  }
  async createRestaurant(req: AuthenticatedRequest, res: Response) {
    const { Restaurant_Name, Location, Food_items } = req.body;

    if (!Restaurant_Name || !Location || !Food_items) {
      res.status(400).json({ message: "All fields are required" });
    }

    const repo = AppDataSource.getRepository(Restaurant);
    const newRestaurant = repo.create({
      Restaurant_Name,
      Location,
      Food_items,
      admin: req.admin.id,
    });

    await repo.save(newRestaurant);
    res.status(201).json(newRestaurant);
    res.json(newRestaurant);
  }
  async updateRestaurant(req: Request, res: Response) {
    const resId = req.params.id;
    const repo = AppDataSource.getRepository(Restaurant);
    const existingRestaurant = await repo.findBy({ id: resId });

    if (!existingRestaurant) {
      throw new Error("Restaurant not found");
    }

    const updatedContact = await repo.update(req.params.id, req.body);
    res.status(200).json(updatedContact);
  }
  async deleteRestaurant(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Restaurant);
      const deleteResult = await repo.delete(req.params.id);

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
