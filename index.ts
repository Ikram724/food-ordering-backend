import express, {
  Express,
  Request,
  Response,
  Application,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import router from "./src/auth/auth.routes";
import { DataSource } from "typeorm";
import "reflect-metadata";
import router1 from "./src/users/userRoutes";

//For env File
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "Molajat112",
  database: "task_management",
  entities: ["src/entities/*{.ts}"],
  synchronize: true,
  logging: true,
})
  .initialize()
  .then(() => {
    console.log(`connected`);
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => console.log("error connecting database"));
const app: Application = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use("/auth", router);
app.use("/users", router1);
