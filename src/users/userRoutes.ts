import express, { Router } from "express";
import { UserController } from "./userControllers";
const router1: Router = express.Router();

const usercontroller = new UserController();
router1.get("/restaurants", usercontroller.showRestaurants);
router1.get("/restaurant/fooditem/:restaurantId", usercontroller.showFoodItem);
router1.post("/restaurants/fooditem/order", usercontroller.orderFooditem);
// router1.get("/restaurants/allorders/", usercontroller.allOrders);
export default router1;
