import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import User from "./models/User.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
//declare simple user model

dotenv.config();

async function bootstrap(): Promise<void> {
  //step-1: testing db connection
  console.log("Connecting to db");
  try {
    await sequelize.authenticate();
    console.log("MYsql connected successfully");
  } catch (error) {
    console.error("My sql connection  failed:", error);
    process.exit(0);
  }

  //step2: migrate the tables
  console.log("synching db schema");
  try {
    await sequelize.sync({ alter: true });
    console.log("db schema synced");
  } catch (error) {
    console.error("Schema sync failed:");
    process.exit(1);
  }

  //step:3 seed SuperAdmin if not exists
  console.log('Checking seed data');

  try {
    const existing=await User.findByEmail('superadmin@crm.com');
    if(!existing) {
        await User.create({
            name: "Super Admin",
            email: "superadmin@crm.com",
            password: "SuperAdmin@123",
            role:"superadmin" 
        });
        console.log("✅ Super Admin seeded. change the password after first login.")
    }
    else {
        console.log("✅ Seed check passed - super admin already exists");
    }

  }
  catch(error) {
    console.error("❌ seeding failed:",error);
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
  app.use("/api/users",userRoutes);

  app.get("/", (req, res) => {
    res.json({ message: "CRM LITE API IS RUNNING" });
  });

  //global error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandeld error:", err.message);
    res.status(500).json({ message: "Internal server error." });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
  });
}

bootstrap();

void User;
