import { Router, Response } from "express";
import { AuthRequest, protect } from "../middleware/auth.js";
import { ValidationError } from "sequelize";
import Customer from "../models/Customer.js";

const router = Router();

// All customer routes require valid JWT
router.use(protect);

// GET /api/customers
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, search } = req.query;

  try {
    const customers = await Customer.findAllFiltered({
      status: status as string | undefined,
      search: search as string | undefined,
    });
    res.status(200).json(customers);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
});

// GET /api/customers/:id
router.get("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid Customer ID" });
    return;
  }

  try {
    const customer = await Customer.findByPk(id, {
      include: ["creator"] 
    });

    if (!customer) {
      res.status(404).json({ message: "Customer not found." });
      return;
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/customers
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, company, email, phone, city, status, notes } = req.body;

  if (!name) {
    res.status(400).json({ message: "Customer name is required" });
    return;
  }

  try {
    // Check if user exists in request (from protect middleware)
    if (!req.user) {
       res.status(401).json({ message: "Unauthorized: User info missing" });
       return;
    }

    const creator = req.user;

    // Create the customer with the snapshot fields
    const customer = await Customer.create({
      name,
      company: company || "",
      email: email || "",
      phone: phone || "",
      city: city || "",
      status: status || "Lead",
      notes: notes || "",
      created_by: creator.id,
      created_by_name: creator.name,   // ✅ Added
      created_by_email: creator.email, // ✅ Added
      created_by_role: creator.role,   // ✅ Added
    });

    res.status(201).json(customer);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({
        message: "Validation failed.",
        errors: error.errors.map((e) => e.message),
      });
      return;
    }
    console.error("POST Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/customers/:id
router.put("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }
    
    // update() only updates the fields passed in req.body
    const updated = await customer.update(req.body);
    res.status(200).json(updated);
  } catch (error) {
    if (error instanceof ValidationError) {
        res.status(400).json({ message: error.errors[0].message });
        return;
    }
    res.status(500).json({ message: "Update failed" });
  }
});

// DELETE /api/customers/:id
router.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  try {
      const customer = await Customer.findByPk(id);
      if (!customer) {
        res.status(404).json({ message: "Not found" });
        return;
      }
      await customer.destroy();
      res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Deletion failed" });
  }
});

export default router;