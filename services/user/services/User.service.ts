import { randomUUID } from "crypto";
import type { CreateUserDto } from "../dtos/create-user.dto";
import type { UpdateUserDto } from "../dtos/update-user.dto";
import type { User } from "../models/User.model";
import { UserRepository } from "../repositories/User.repository";

export class UserService {
  constructor(private repository: UserRepository) {}

  getAll(): Promise<User[]> {
    return this.repository.findAll();
  }

  getById(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  create(data: CreateUserDto): Promise<void> {
    const user: User = { id: randomUUID(), ...data };
    return this.repository.create(user);
  }

  update(id: string, data: UpdateUserDto): Promise<void> {
    return this.repository.update(id, data);
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
