
import { Router,Response } from "express";
import { AuthRequest,protect } from "../middleware/auth.js";
import { ValidationError } from "sequelize";
import Customer from "../models/Customer.js";

const router= Router();

//all customer route requrie valid jwt
router.use(protect);

// get api/customers
//query params: ?status=Active ? search=priya
router.get("/",async (req:AuthRequest,res:Response):Promise<void> => {
    const {status,search}=req.query;

    const customers=await Customer.findAllFiltered({
        status: status as string | undefined,
        search: search as string | undefined,
    });

    res.status(200).json(customers);
})

//get api/customers/:id
//find by pk
router.get("/:id",async (req:AuthRequest,res:Response):Promise<void> => {
    const id=Number(req.params.id);

    if(isNaN(id)) {
        res.status(400).json({message:"Invalid Customer ID"});
        return;
    }

    const customer=await Customer.findByPk(id);

    if(!customer) {
        res.status(404).json({message:"customer not found."});
        return;
    }

    res.status(200).json(customer);
});

//post /api/customer/:id
router.post("/:id",async (req:AuthRequest,res:Response):Promise<void> => {
    const {name,company,email,phone,city,status,notes}=req.body;

    if(!name) {
        res.status(400).json({message:"Customer name is requried"});
        return;
    }

    try {
        const customer=await Customer.create({
            name,
            company: company || "",
            email: email || "",
            phone: phone || "",
            city: city || "",
            status: status || "Lead",
            notes: notes || "",
        });

        res.status(201).json(customer);
    }catch(error) {
        if(error instanceof ValidationError) {
            res.status(400).json({
                message:"Validation failed.",
                errors: error.errors.map((e)=> e.message),
            });
            return;
        }
        throw error;
    }
});

// put /api/customers/:id
//inctance.update(data) only updates fields present in data
router.put("/:id",async(req:AuthRequest,res:Response):Promise<void> => {
    const id=Number(req.params.id);

    if(isNaN(id)) {
        res.status(400).json({message:"Invalid customer"});
        return;
    }

    const customer=await Customer.findByPk(id);
    if(!customer) {
        res.status(400).json({message:"customer not found!"});
        return;
    }
    try {
       const updated=await customer.update(req.body);
       res.status(200).json(updated);
    }
    catch(error) {
        if(error instanceof ValidationError) {
            res.status(400).json({
                message:"validation failed",
                errors:error.errors.map((e)=>e.message),
            });
            return;
        }
        throw error;
    }
});

//detele /api/customers/:id
//instance.destroy() -> Delete from customers, where id=?
router.delete("/:id",async(req:AuthRequest,res:Response) => {
    const id=Number(req.params.id);

    if(isNaN(id)) {
        res.status(400).json({message:"Invalid customer id"});
        return;
    }

    const customer=await Customer.findByPk(id);

    if(!customer) {
        res.status(404).json({message:"Customer not found."});
        return;
    }

    await customer.destroy();
    res.status(200).json({message:"customer deleted successfully."});
    return;
});

export default router;