import express, { Router } from "express";
import { AuthController } from "./auth.controller";
import verifyToken from "./authmiddleware";
import { UserController } from "../users/userControllers";

const router: Router = express.Router();
const authController = new AuthController();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/restaurants/allorders", authController.allOrders);
router.use(verifyToken);
router.get("/restaurants", authController.getAllRestaurants);
router.get("/restaurants/:id", authController.getResById);
router.post("/restaurants/create", authController.createRestaurant);
router.put("/restaurants/update/:id", authController.updateRestaurant);
router.delete("/restaurants/delete/:id", authController.deleteRestaurant);

export default router;
