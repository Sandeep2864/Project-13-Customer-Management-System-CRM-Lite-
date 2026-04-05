import { AuthRequest, protect } from './../middleware/auth.js';
import { Router, Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";
import User from "../models/User.js";
//middleware future for protection

const router = Router();

const generateToken = (id: number, role: string): string => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as StringValue;
  const options: SignOptions = { expiresIn };
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, options);
};

//create the post /api/auth/login

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = await User.findByEmail(email);
  if (!user) {
    res.status(401).json({ message: "Invalid Credentails. 1" });
    return;
  }

  if (!user.is_active) {
    res.status(403).json({ message: "Account deactived. Contact SuperAdmin" });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid credentails. 2" });
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
router.get("/me",protect,async(req:AuthRequest,res:Response):Promise<void> => {
  const user=await User.findByPk(req.user!.id, {
    attributes:{exclude:["password"]},
  });

  if(!user) {
    res.status(404).json({message:"User not found. "});
  }
  res.status(200).json(user);
})

router.post("/logout",protect,(_req:Request,res:Response):void => {
  res.status(200).json({message:"Logged out successfully."});
});

export default router;
