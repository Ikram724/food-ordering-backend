import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../entities/auth.entity";
import dotenv from "dotenv";

dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: any; // Adjust the type based on your decoded token structure
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
    jwt.verify(token, "secret_key", (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User not authorized");
      }
      req.user = decoded;
      next();
    });
    if (!token) {
      res.status(401);
      throw new Error("User is not authorized or token is missing");
    }
  }
};

export default verifyToken;
