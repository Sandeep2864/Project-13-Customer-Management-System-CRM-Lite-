// src/server.ts  — FULL FILE (replaces your existing one)
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import User from "./models/User.js";
import Customer from "./models/Customer.js";
import PasswordResetToken from "./models/PasswordResetToken.js"; // ← ADD THIS
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import customerRoutes from "./routes/customers.js";

dotenv.config();

async function bootstrap(): Promise<void> {
  // step-1: test db connection
  console.log("Connecting to db");
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully");
  } catch (error) {
    console.error("MySQL connection failed:", error);
    process.exit(0);
  }

  // step-2: sync schema
  // sequelize.sync({ alter: true }) will automatically CREATE the new
  // password_reset_tokens table — you don't need to do anything manually.
  console.log("Syncing db schema");
  try {
    await sequelize.sync({ alter: true });
    console.log("db schema synced");
  } catch (error) {
    console.error("Schema sync failed:", error);
    process.exit(1);
  }

  // step-3: seed SuperAdmin if not exists
  console.log("Checking seed data");
  try {
    const existing = await User.findByEmail("superadmin@crm.com");
    if (!existing) {
      await User.create({
        name: "Super Admin",
        email: "superadmin@crm.com",
        password: "SuperAdmin@123",
        role: "superadmin",
      });
      console.log("✅ Super Admin seeded. Change the password after first login.");
    } else {
      console.log("✅ Seed check passed — super admin already exists");
    }
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }

  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    }),
  );

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/customers", customerRoutes);

  app.get("/", (_req, res) => {
    res.json({ message: "CRM LITE API IS RUNNING" });
  });

  // global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ message: "Internal server error." });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
}

bootstrap();

void User;
void Customer;
void PasswordResetToken; // ← keeps the model registered with Sequelize