import {Router,Response} from 'express';
import { UniqueConstraintError,ValidationError } from 'sequelize';
import User from '../models/User.js';
import { protect,superAdminOnly,AuthRequest } from '../middleware/auth.js';

const router=Router();

//apply both middleware to every route in this file
router.use(protect,superAdminOnly)

//get api/users
//list all admin accounts to every  route in this file
router.get("/",async(req:AuthRequest,res:Response):Promise<void> => {
    const users=await User.findAllAdmins();
    res.status(200).json(users);
});
