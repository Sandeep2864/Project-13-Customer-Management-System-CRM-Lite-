import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import User from "./models/User.js";
import Customer from "./models/Customer.js";
import PasswordResetToken from "./models/PasswordResetToken.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import customerRoutes from "./routes/customers.js";

dotenv.config();

const app = express();

// ✅ ALLOWED ORIGINS
const allowedOrigins = [
  "http://localhost:5173",
  "https://project-13-customer-management-syst.vercel.app"
];

// ✅ CORS CONFIG (single source of truth)
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// ✅ APPLY CORS (ONLY ONCE)
app.use(cors(corsOptions));

// ✅ FIX PRE-FLIGHT REQUESTS (IMPORTANT)
app.options("*", cors(corsOptions));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "CRM LITE API IS RUNNING" });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error." });
});

// DB init (safe for serverless)
let isDbConnected = false;

async function initDB() {
  if (isDbConnected) return;

  try {
    console.log("Connecting to DB...");
    await sequelize.authenticate();

    console.log("Syncing DB...");
    await sequelize.sync();

    const existing = await User.findOne({
      where: { email: "superadmin@crm.com" },
    });

    if (!existing) {
      await User.create({
        name: "Super Admin",
        email: "superadmin@crm.com",
        password: "SuperAdmin@123",
        role: "superadmin",
      });
      console.log("✅ Super Admin seeded");
    }

    isDbConnected = true;
  } catch (err) {
    console.error("DB Init Failed:", err);
  }
}

// Vercel handler
export default async function handler(req: any, res: any) {
  await initDB();
  return app(req, res);
}

// keep models registered
void User;
void Customer;
void PasswordResetToken;
