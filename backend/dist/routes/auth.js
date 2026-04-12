import { protect } from './../middleware/auth.js';
import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import PasswordResetToken from "../models/PasswordResetToken.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";
//middleware future for protection
const router = Router();
const generateToken = (id, role) => {
    const expiresIn = (process.env.JWT_EXPIRES_IN || "7d");
    const options = { expiresIn };
    return jwt.sign({ id, role }, process.env.JWT_SECRET, options);
};
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }
    const user = await User.findByEmail(email);
    if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    if (!user.is_active) {
        res.status(403).json({ message: "Account is deactivated. Contact Super Admin" });
        return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    const token = generateToken(user.id, user.role);
    res.status(200).json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});
// GET /api/auth/me
router.get("/me", protect, async (req, res) => {
    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
    });
    if (!user) {
        res.status(404).json({ message: "User not found. " });
    }
    res.status(200).json(user);
});
router.post("/logout", protect, (_req, res) => {
    res.status(200).json({ message: "Logged out successfully." });
});
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await User.findByEmail(email);
    // don't reveal if email exists (security)
    if (!user) {
        res.status(200).json({ message: "If email exists, reset link sent." });
        return;
    }
    // 🔥 generate token
    const token = crypto.randomBytes(32).toString("hex");
    // 🔥 expiry = 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    // save in DB
    await PasswordResetToken.create({
        user_id: user.id,
        token,
        expires_at: expiresAt,
    });
    // send email
    await sendPasswordResetEmail(user.email, user.name, token);
    res.status(200).json({ message: "Reset link sent to email." });
});
router.get("/verify-reset-token", async (req, res) => {
    const token = typeof req.query.token === "string" ? req.query.token : undefined;
    if (!token) {
        res.status(400).json({ valid: false });
        return;
    }
    const record = await PasswordResetToken.findOne({ where: { token } });
    if (!record || !record.isValid()) {
        res.status(400).json({ valid: false });
        return;
    }
    res.status(200).json({ valid: true });
});
router.post("/reset-password", async (req, res) => {
    const { token, password } = req.body;
    const record = await PasswordResetToken.findOne({ where: { token } });
    if (!record || !record.isValid()) {
        res.status(400).json({ message: "Invalid or expired token" });
        return;
    }
    const user = await User.findByPk(record.user_id);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    // 🔥 update password (bcrypt auto runs)
    user.password = password;
    await user.save();
    // mark token used
    record.used = true;
    await record.save();
    res.status(200).json({ message: "Password updated successfully" });
});
export default router;
