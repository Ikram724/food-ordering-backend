import bcrypt from "bcrypt";
import { IUser } from "./dto/user.interface";
import { Admin } from "../entities/auth.entity";

export class UserService {
  private users: Admin[] = [];

  async createUser(username: string, password: string): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: Admin = {
      username,
      password: hashedPassword,
      id: "uuid",
    };
    this.users.push(user);
    return user;
  }

  async findUserByUsername(username: string): Promise<Admin | null> {
    return this.users.find((user) => user.username === username) || null;
  }
}
