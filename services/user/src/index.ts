import express from "express";
import { MongoClient } from "mongodb";
import userRoutes from "../routes/user.routes"; // 👈 importa el router

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/users", userRoutes); // ✅ usa el router, no una función

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/userdb';

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    app.listen(3000, () => console.log("🚀 Server ready on http://localhost:3000"));
  } catch (err) {
    console.error("❌ MongoDB error:", err);
  }
}

run();
