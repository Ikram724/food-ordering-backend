import bcrypt from "bcrypt";
import { Admin } from "../entities/auth.entity";
import { getRepository } from "typeorm";
import { DataSource } from "typeorm";
import { AppDataSource } from "../..";
export class UserService {
  async createUser(username: string, password: string): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const repo = AppDataSource.getRepository(Admin);
    const createUser = repo.create({
      username,
      password: hashedPassword,
    });

    const saved = await repo.save(createUser);
    return saved;
  }

  async findUserByUsername(username: string): Promise<Admin | null> {
    const user = await AppDataSource.getRepository(Admin).findOne({
      where: { username },
    });
    return user || null;
  }
}
