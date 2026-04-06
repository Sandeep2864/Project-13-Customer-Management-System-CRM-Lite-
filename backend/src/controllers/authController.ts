import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { RowDataPacket } from "mysql2/promise";
import pool from "../config/db.js";
import type { AuthUser, JwtUserPayload, UserRow } from "../types/index.js";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

const mapAuthUser = (user: UserRow): AuthUser => ({
  _id: String(user.id),
  name: user.name,
  email: user.email,
  role: user.role,
});

const signToken = (user: UserRow) => {
  const payload: JwtUserPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as Parameters<
    typeof jwt.sign
  >[2] extends infer T
    ? T extends { expiresIn?: infer E }
      ? E
      : never
    : never;

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn,
  });
};

export const login = async (req: Request, res: Response) => {
  const email = req.body?.email?.trim().toLowerCase();
  const password = req.body?.password;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, email, password, role, isActive, createdAt FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    const user = (rows as UserRow[])[0];

    if (!user) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    if (!Boolean(user.isActive)) {
      res.status(403).json({ message: "This account is currently inactive." });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    res.status(200).json({
      token: signToken(user),
      user: mapAuthUser(user),
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Authentication is required." });
    return;
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, email, password, role, isActive, createdAt FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    const user = (rows as UserRow[])[0];

    if (!user || !Boolean(user.isActive)) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json(mapAuthUser(user));
  } catch (error) {
    console.error("Failed to load current user:", error);
    res.status(500).json({ message: "Unable to load the current user." });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.status(204).send();
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const email = req.body?.email?.trim().toLowerCase();

  if (!email) {
    res.status(400).json({ message: "Email is required." });
    return;
  }

  res.status(202).json({
    message:
      "If the account exists, a password reset email would be sent from here.",
  });
};
