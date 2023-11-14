import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../entities/auth.entity";
import dotenv from "dotenv";
import { AppDataSource } from "../..";

dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: any;
}

const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  let authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, "secret_key", (err, decoded: any) => {
      if (err) {
        res.status(401);
        throw new Error("User not authorized");
      }
      console.log("admin", decoded?.user);
      const userRepo = AppDataSource.getRepository(Admin);
      const user = userRepo.findOne({ where: { id: decoded?.user?.id } });
      req.user = user;
      next();
    });
    if (!token) {
      res.status(401);
      throw new Error("User is not authorized or token is missing");
    }
  }
};

export default verifyToken;
