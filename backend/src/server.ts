import express from "express";
import type {Request,Response} from "express";
import dotenv from "dotenv";
import pool from "./models/db.ts";

dotenv.config();
const app=express();
app.use(express.json());

const PORT=process.env.PORT || 5000

const checkConnection= async()=> {
   try {
     const connection=await pool.getConnection();
     console.log("Successfully connected to the database");
     connection.release();
   }
   catch(error) {
    console.log('Db connection failed!',error);
   }
}


app.get("/",(req:Request,res:Response) => {
    res.send("the api is working fine");
});

app.listen(PORT,async ()=> {
    await checkConnection();
    console.log(`Server is running on port : ${PORT}`);
});
