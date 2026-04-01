import express, { NextFunction,Request,Response } from 'express';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';
import cors from 'cors';

const app=express();
dotenv.config();

app.use(express.json());
app.use(cors({
    origin:process.env.CLIENT_URL || "http://localhost:5173",
    credentials:true
}))

//mounting routes will be over here


//here simple api
app.get("/",(req,res) => {
    res.json({message:"Welcome to CRM Lite API"})
})


//here global error handling middleware
app.use( (err:Error,req:Request,res:Response,next:NextFunction) => {
   console.error('Unexpected handled Error',err.message)
   res.status(500).json({message:"Internal Server Error"})
})


//port connection
const PORT=(process.env.PORT||5000)
app.listen(PORT, async() => {
    await testConnection();
    console.log(`Server is running on port ${PORT}`);
})

