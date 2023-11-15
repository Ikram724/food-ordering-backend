import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UserService } from "./auth.service";
import bcrypt from "bcrypt";
import { Restaurant } from "../entities/restaurant.entity";
import { getRepository } from "typeorm";
import { Admin } from "../entities/auth.entity";
import { AppDataSource } from "../..";
import { Order } from "../entities/order.entity";

interface AuthenticatedRequest extends Request {
  user?: Admin; // Adjust the type based on your decoded token structure
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
      const token = jwt.sign(
        {
          user: { username: user.username, id: user.id },
        },
        "secret_key",
        {
          expiresIn: expirationTime,
        }
      );
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  }
  async getAllRestaurants(req: AuthenticatedRequest, res: Response) {
    const repo = AppDataSource.getRepository(Restaurant);
    console.log(req.user);
    const allRestaurants = await repo.find({
      where: { admin: { id: req.user?.id } },
    });
    res.json(allRestaurants);
  }

  async getResById(req: AuthenticatedRequest, res: Response) {
    try {
      const resid = req.params.id;
      const repo = AppDataSource.getRepository(Restaurant);
      const resById = await repo.findOne({
        where: { id: resid, admin: req.user },
      });
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
    });

    await repo.save(newRestaurant);
    res.status(201).json(newRestaurant);
  }
  async updateRestaurant(req: AuthenticatedRequest, res: Response) {
    const resId = req.params.id;
    const repo = AppDataSource.getRepository(Restaurant);
    const existingRestaurant = await repo.findOne({
      where: { id: resId, admin: req.user },
    });

    if (!existingRestaurant) {
      throw new Error("Restaurant not found");
    }

    const updatedContact = await repo.update(req.params.id, req.body);
    res.status(200).json(updatedContact);
  }
  async deleteRestaurant(req: AuthenticatedRequest, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Restaurant);
      const deleteResult = await repo.delete(req.params.id);

      if (deleteResult.affected !== undefined && deleteResult.affected) {
        res.status(204).json({ message: `restaurant deleted` });
      } else {
        res.status(404).json({ message: "Restaurant not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async allOrders(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Order);
    const order = await repo.find();
    res.json(order);
  }
}
