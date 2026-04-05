import { Router, Response } from "express";
import { UniqueConstraintError, ValidationError } from "sequelize";
import User from "../models/User.js";
import { protect, superAdminOnly, AuthRequest } from "../middleware/auth.js";
// import Message from "tedious/lib/message.js";

const router = Router();

//apply both middleware to every route in this file
router.use(protect, superAdminOnly);

//get api/users
//list all admin accounts to every  route in this file
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const users = await User.findAllAdmins();
  res.status(200).json(users);
});

//post  /api/users
//create a new admin account
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: " Name, email and password are required" });
    return;
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      res
        .status(409)
        .json({ Message: " An Account with this email already exists. " });
      return;
    }
    if (error instanceof ValidationError) {
      res.status(400).json({
        message: "Validatoin failed.",
        errors: error.errors.map((e) => e.message),
      });
      return;
    }
    throw error;
  }
});


router.put("/:id",async (req:AuthRequest,res:Response):Promise<void> => {
  const id=Number(req.params.id);
  const {name,email}=req.body;

  if(isNaN(id)) {
    res.status(400).json({message:"Invalid admin Id."});
    return;
  }

  const user=await User.findByPk(id, {
    attributes:{exclude:["password"]},
  });

  if(!user) {
    res.status(404).json({message:"Admin not found"});
    return;
  }
  try {
    const updated=await user.update({name,email});
    res.status(200).json(updated);
  }
  catch(error) {
    if(error instanceof UniqueConstraintError) {
      res.status(409).json({message:"Email already in use."});
      return;
    }
    throw error;
  }
});




export default router;
