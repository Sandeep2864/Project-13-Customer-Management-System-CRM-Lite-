

import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        role:String;
    };
}

export const protect = (req:AuthRequest,res:Response,next:NextFunction): void => {
    const authHeader=req.headers.authorization;

    if(!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({message:" No token provided. Access denied."});
        return;
    }

    const token=authHeader.split(" ")[1];
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET as string) as {
            id:number;
            role:string;
        };

        req.user=decoded;
        next();
    }
    catch {
        res.status(401).json({message:"Invalid or expired token. "});
    }
};

//super admin onlyr
export const superAdminOnly = (req:AuthRequest,res:Response,next:NextFunction):void => {
    if(req.user?.role!=="superadmin") {
        res.status(403).json({message:"access denied. SuperAdmin only."})
        return;
    }
    next();
};