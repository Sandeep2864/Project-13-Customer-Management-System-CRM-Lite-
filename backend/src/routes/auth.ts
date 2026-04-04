
import {Router,Request,Response} from 'express';
import jwt, {SignOptions} from 'jsonwebtoken';
import {StringValue} from 'ms';
import User from '../model/User.js';
//middleware future for protection

const router=Router();

const generateToken= (id:number,role:string): string => {
    const expiresIn=(process.env.JWT_EXPIRES_IN||"7d") as StringValue;
    const options:SignOptions={expiresIn};
    return jwt.sign({id,role},process.env.JWT_SECRET as string,options);
}

//create the post /api/auth/login

