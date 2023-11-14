import express, { Application } from "express";
import dotenv from "dotenv";
import router from "./src/auth/auth.routes";
import "reflect-metadata";
import router1 from "./src/users/userRoutes";
import { Restaurant } from "./src/entities/restaurant.entity";
import { Food } from "./src/entities/fooditem.entity";
import { Admin } from "./src/entities/auth.entity";
import { DataSource } from "typeorm";
import { Order } from "./src/entities/order.entity";
// For env File
dotenv.config();
const app: Application = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use("/auth", router);
app.use("/users", router1);

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "Molajat112",
  database: "task_management",
  entities: [Admin, Restaurant, Food, Order],
  synchronize: true,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
    app.listen(port, () => {
      console.log(`app is running on ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
