import type { Request, Response } from "express";
import { UserService } from "../services/User.service";

export class UserController {
  constructor(private service: UserService) {}

  async getAll(req: Request, res: Response) {
    const users = await this.service.getAll();
    res.json(users);
  }

  async getById(req: Request, res: Response) {
    const user = await this.service.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  }

  async create(req: Request, res: Response) {
    await this.service.create(req.body);
    res.status(201).json({ message: "User created" });
  }

  async update(req: Request, res: Response) {
    await this.service.update(req.params.id, req.body);
    res.json({ message: "User updated" });
  }

  async delete(req: Request, res: Response) {
    await this.service.delete(req.params.id);
    res.json({ message: "User deleted" });
  }
}
