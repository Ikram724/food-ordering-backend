import express, { Router } from "express";
import { UserController } from "./userControllers";
const router1: Router = express.Router();

const usercontroller = new UserController();
router1.get("/restaurants", usercontroller.showRestaurants);
router1.get("/restaurants/fooditem", usercontroller.showFoodItem);
router1.post("/restaurants/fooditem/order", usercontroller.orderFooditem);

export default router1;
