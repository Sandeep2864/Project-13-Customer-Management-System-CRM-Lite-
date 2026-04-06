import type {Request,Response} from 'express';
import pool from '../models/db.js';
import type { User } from '../types/index.js';


export const getUsers = async(req:Request,res:Response) => {
    try {
        const [rows]=await pool.query('SELECT id,name,email,role,isActive,createdAt FROM users');

        res.status(200).json({
            success:true,
            data:rows as User[]
        });
    }
    catch(error) {
        console.error('Error fetching users:',error);
        res.status(500).json({
            success:false,
            message:'Failed to retreview users'
        });
    }
}