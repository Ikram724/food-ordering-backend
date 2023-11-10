import bcrypt from "bcrypt";
import { Admin } from "../entities/auth.entity";
import { getRepository } from "typeorm";

export class UserService {
  async createUser(username: string, password: string): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await getRepository(Admin).create({
      username,
      password: hashedPassword,
    });

    const saved = await getRepository(Admin).save(user);
    return saved;
  }

  async findUserByUsername(username: string): Promise<Admin | null> {
    const user = await getRepository(Admin).findOne({ username });
    return user || null;
  }
}
