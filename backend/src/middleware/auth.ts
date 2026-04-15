import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ 1. Interface for Type Safety
export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

// ✅ 2. Protect Middleware (Fetches full user data from DB)
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email", "role"],
    });

    if (!user) {
      res.status(401).json({ message: "User no longer exists." });
      return;
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

// ✅ 3. SuperAdminOnly Middleware (The missing piece!)
export const superAdminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== "superadmin") {
    res.status(403).json({ message: "Access denied. SuperAdmin only." });
    return;
  }
  next();
};