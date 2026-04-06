import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import pool from "../config/db.js";
import type {
  Customer,
  CustomerRow,
  CustomerStatus,
} from "../types/index.js";

const validStatuses = new Set<CustomerStatus>(["Lead", "Active", "Inactive"]);

const mapCustomer = (row: CustomerRow): Customer => ({
  _id: String(row.id),
  name: row.name,
  company: row.company,
  email: row.email,
  phone: row.phone,
  city: row.city,
  status: row.status,
  notes: row.notes || "",
  createdAt:
    row.createdAt instanceof Date
      ? row.createdAt.toISOString()
      : String(row.createdAt),
});

const parseCustomerInput = (body: Request["body"]) => {
  const customer = {
    name: body?.name?.trim(),
    company: body?.company?.trim(),
    email: body?.email?.trim().toLowerCase(),
    phone: body?.phone?.trim(),
    city: body?.city?.trim(),
    status: body?.status as CustomerStatus | undefined,
    notes: body?.notes?.trim() || "",
  };

  const requiredFields = [
    customer.name,
    customer.company,
    customer.email,
    customer.phone,
    customer.city,
    customer.status,
  ];

  if (requiredFields.some((field) => !field)) {
    return {
      error:
        "Name, company, email, phone, city, and status are all required.",
    };
  }

  if (!validStatuses.has(customer.status as CustomerStatus)) {
    return { error: "Customer status must be Lead, Active, or Inactive." };
  }

  return { value: customer };
};

const isDuplicateError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "ER_DUP_ENTRY";

export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, company, email, phone, city, status, notes, createdAt FROM customers ORDER BY createdAt DESC"
    );

    res.status(200).json((rows as CustomerRow[]).map(mapCustomer));
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    res.status(500).json({ message: "Unable to load customers." });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, company, email, phone, city, status, notes, createdAt FROM customers WHERE id = ? LIMIT 1",
      [req.params.customerId]
    );

    const customer = (rows as CustomerRow[])[0];

    if (!customer) {
      res.status(404).json({ message: "Customer not found." });
      return;
    }

    res.status(200).json(mapCustomer(customer));
  } catch (error) {
    console.error("Failed to fetch customer:", error);
    res.status(500).json({ message: "Unable to load that customer." });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  const parsedInput = parseCustomerInput(req.body);

  if (parsedInput.error) {
    res.status(400).json({ message: parsedInput.error });
    return;
  }

  const customerInput = parsedInput.value;

  if (!customerInput) {
    res.status(400).json({ message: "Invalid customer payload." });
    return;
  }

  const { name, company, email, phone, city, status, notes } = customerInput;

  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO customers (name, company, email, phone, city, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, company, email, phone, city, status, notes || null]
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, company, email, phone, city, status, notes, createdAt FROM customers WHERE id = ? LIMIT 1",
      [result.insertId]
    );

    res.status(201).json(mapCustomer((rows as CustomerRow[])[0]));
  } catch (error) {
    if (isDuplicateError(error)) {
      res.status(409).json({ message: "A customer with that email already exists." });
      return;
    }

    console.error("Failed to create customer:", error);
    res.status(500).json({ message: "Unable to create the customer." });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  const parsedInput = parseCustomerInput(req.body);

  if (parsedInput.error) {
    res.status(400).json({ message: parsedInput.error });
    return;
  }

  const customerInput = parsedInput.value;

  if (!customerInput) {
    res.status(400).json({ message: "Invalid customer payload." });
    return;
  }

  const { name, company, email, phone, city, status, notes } = customerInput;

  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE customers SET name = ?, company = ?, email = ?, phone = ?, city = ?, status = ?, notes = ? WHERE id = ?",
      [name, company, email, phone, city, status, notes || null, req.params.customerId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Customer not found." });
      return;
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, company, email, phone, city, status, notes, createdAt FROM customers WHERE id = ? LIMIT 1",
      [req.params.customerId]
    );

    res.status(200).json(mapCustomer((rows as CustomerRow[])[0]));
  } catch (error) {
    if (isDuplicateError(error)) {
      res.status(409).json({ message: "A customer with that email already exists." });
      return;
    }

    console.error("Failed to update customer:", error);
    res.status(500).json({ message: "Unable to update the customer." });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM customers WHERE id = ?",
      [req.params.customerId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Customer not found." });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete customer:", error);
    res.status(500).json({ message: "Unable to delete the customer." });
  }
};
