import express, {
  Express,
  Request,
  Response,
  Application,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import router from "./src/auth/auth.routes";
import "reflect-metadata";
import router1 from "./src/users/userRoutes";
import { Connection, createConnection } from "typeorm";
import { Restaurant } from "./src/entities/restaurant.entity";
import { Food } from "./src/entities/fooditem.entity";
import { Admin } from "./src/entities/auth.entity";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 20;
// For env File
dotenv.config();
const app: Application = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use("/auth", router);
app.use("/users", router1);

async function initializeDatabases(): Promise<Connection> {
  const connection = await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Molajat112",
    database: "task_management",
    entities: [Restaurant, Food, Admin],
    synchronize: true,
    logging: true,
  });
  return connection;
}

// export const AppDataSource = new DataSource({
//   type: "mysql",
//   host: "localhost",
//   port: 3306,
//   username: "root",
//   password: "Molajat112",
//   database: "task_management",
//   entities: ["src/entities/*{.ts}"],
//   synchronize: true,
//   logging: true,
// })
// .initialize()
// .then(() => {
//   console.log(`connected`);
//   app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
//   });
// })
// .catch((err) => console.log("error connecting database"));
initializeDatabases().then(() => {
  console.log("connected");
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});
