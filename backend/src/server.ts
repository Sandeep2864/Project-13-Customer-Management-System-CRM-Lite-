// ================== 🔹 IMPORTS ==================
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

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

// ================== 🔹 ENV CONFIG ==================
const isProduction = process.env.NODE_ENV === "production";

dotenv.config({
  path: isProduction ? ".env.production" : ".env",
});

// ================== 🔹 APP INIT ==================
const app = express();
const PORT = process.env.PORT || 5000;

// ================== 🔹 CORS CONFIG ==================
const allowedOrigins = isProduction
  ? [
      "https://project-13-customer-management-system-crm-sandeep2864s-projects.vercel.app",
    ]
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🌐 Incoming Origin:", origin);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS Blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ================== 🔹 MIDDLEWARE ==================
app.use(express.json());

// ================== 🔹 ROUTES ==================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "🚀 CRM API RUNNING" });
});

// ================== 🔹 ERROR HANDLER ==================
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// ================== 🔹 DB INIT ==================
let isDbConnected = false;

async function initDB() {
  if (isDbConnected) return;

  try {
    console.log("🔄 Connecting DB...");
    await sequelize.authenticate();

    console.log("🔄 Syncing DB...");
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
      console.log("✅ Super Admin Seeded");
    }

    isDbConnected = true;
  } catch (err) {
    console.error("❌ DB Init Failed:", err);
  }
}

// ================== 🔹 DEV SERVER ==================
if (!isProduction) {
  (async () => {
    await initDB();

    app.listen(PORT, () => {
      console.log(`🚀 DEV SERVER: http://localhost:${PORT}`);
    });
  })();
}

// ================== 🔹 PRODUCTION HANDLER ==================
export default async function handler(req: any, res: any) {
  await initDB();
  return app(req, res);
}

// ================== 🔹 KEEP MODELS ==================
void User;
void Customer;
void PasswordResetToken;
