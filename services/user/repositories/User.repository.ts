import { MongoClient, Db } from "mongodb";
import type { User } from "../models/User.model";

export class UserRepository {
  private db: Db;
  private collectionName = "users";

  constructor() {
    const uri = process.env.MONGO_URI!;
    const client = new MongoClient(uri);
    this.db = client.db();
    client.connect();
  }

  async findAll(): Promise<User[]> {
    return await this.db.collection<User>(this.collectionName).find().toArray();
  }

  async findById(id: string): Promise<User | null> {
    return await this.db.collection<User>(this.collectionName).findOne({ id });
  }

  async create(user: User): Promise<void> {
    await this.db.collection<User>(this.collectionName).insertOne(user);
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    await this.db.collection<User>(this.collectionName).updateOne({ id }, { $set: data });
  }

  async delete(id: string): Promise<void> {
    await this.db.collection<User>(this.collectionName).deleteOne({ id });
  }
}
