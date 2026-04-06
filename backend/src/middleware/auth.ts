import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtUserPayload } from "../types/index.js";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization token is required." });
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtUserPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const superAdminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "superadmin") {
    res.status(403).json({ message: "Superadmin access is required." });
    return;
  }

  next();
};
