# CRM Lite — Complete Developer Learning Guide
### How to explain every line of your backend at the review

---

## CHAPTER 1 — The Big Picture (explain this first)

```
Browser (React Frontend)
    ↓  HTTP Request (GET/POST/PUT/DELETE)
Express Server (src/index.ts)
    ↓  Middleware (cors, json, auth)
Route Handler (routes/auth.ts, customers.ts, users.ts)
    ↓  Calls model functions
Model (models/User.ts, Customer.ts)
    ↓  Runs SQL query
MySQL Database (Workbench)
    ↓  Returns rows
Model → Route → Express → Browser
```

**When a reviewer asks "what happens when login is called?"**
Say exactly this:
1. Frontend sends POST to `/api/auth/login` with `{ email, password }`
2. Express receives it, `express.json()` parses the body
3. The request goes to `routes/auth.ts` login handler
4. The handler calls `UserModel.findByEmail(email)` — runs SQL `SELECT * FROM users WHERE email = ?`
5. If found, calls `bcrypt.compare(password, user.password)` — checks if password matches hash
6. If match, calls `jwt.sign({ id, role }, JWT_SECRET)` — creates a token
7. Sends back `{ token, user }` — frontend stores token in localStorage

---

## CHAPTER 2 — TypeScript in 5 Concepts

### 2.1 — Types on variables
```typescript
// JavaScript (no types)
let name = "Priya";

// TypeScript (with type)
let name: string = "Priya";
let age: number = 25;
let active: boolean = true;
let ids: number[] = [1, 2, 3];  // array of numbers
```

### 2.2 — Interface (shape of an object)
```typescript
// Describes what a row from the MySQL users table looks like
interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "superadmin";  // union type: ONLY these 2 values
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Now TypeScript checks every usage of IUser
const user: IUser = { id: 1, name: "Priya", ...etc }
```

### 2.3 — Async/Await (for database calls)
```typescript
// Every database call takes time. We use async/await to wait for it.
// Without async/await you'd get undefined because MySQL hasn't responded yet.

async function getUser(id: number): Promise<IUser | null> {
  //    ↑ async keyword lets us use await inside
  //                                   ↑ Promise<IUser|null> = return type

  const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
  //            ↑ await = "wait for MySQL to respond before continuing"

  const users = rows as IUser[];
  return users[0] || null;  // return first row, or null if empty
}
```

### 2.4 — Destructuring (you see this everywhere)
```typescript
// Array destructuring — [rows] from pool.execute
const [rows] = await pool.execute("SELECT * FROM users");
// pool.execute returns [RowDataPacket[], FieldPacket[]]
// We only want the first element (the rows), so [rows] unpacks it

// Object destructuring — { email, password } from req.body
const { email, password } = req.body;
// Same as: const email = req.body.email; const password = req.body.password;
```

### 2.5 — Type assertion (the 'as' keyword)
```typescript
const [rows] = await pool.execute("SELECT * FROM users");
// TypeScript doesn't know what type 'rows' is — mysql2 returns generic type
// We TELL TypeScript: "trust me, these are IUser objects"
const users = rows as IUser[];
//                  ↑ "as IUser[]" = type assertion
```

---

## CHAPTER 3 — MySQL vs MongoDB Side by Side

### Every operation compared

| Operation | MongoDB (Mongoose) | MySQL (mysql2) |
|---|---|---|
| Find one by email | `User.findOne({ email })` | `pool.execute("SELECT * FROM users WHERE email = ?", [email])` |
| Find by ID | `User.findById(id)` | `pool.execute("SELECT * FROM users WHERE id = ?", [id])` |
| Find all | `User.find({})` | `pool.execute("SELECT * FROM users")` |
| Create | `User.create({ name, email })` | `pool.execute("INSERT INTO users (name,email) VALUES (?,?)", [name,email])` |
| Update | `User.findByIdAndUpdate(id, body)` | `pool.execute("UPDATE users SET name=? WHERE id=?", [name, id])` |
| Delete | `User.findByIdAndDelete(id)` | `pool.execute("DELETE FROM users WHERE id=?", [id])` |
| Filter | `Customer.find({ status: "Lead" })` | `pool.execute("SELECT * FROM customers WHERE status=?", ["Lead"])` |
| Sort | `.sort({ createdAt: -1 })` | `ORDER BY created_at DESC` |
| Count deleted | `result.deletedCount` | `result.affectedRows` |
| New row ID | `result._id` | `result.insertId` |

---

## CHAPTER 4 — The Pool (db.ts explained)

```typescript
// mysql.createPool() creates a POOL of 10 connections
// Think of it like 10 database "lanes" open at all times

const pool = mysql.createPool({
  host: "localhost",          // where MySQL is running
  port: 3306,                 // default MySQL port
  user: "root",               // MySQL username
  password: "Sandeep@41800",  // MySQL password
  database: "crm",            // which database to use

  waitForConnections: true,   // queue requests if all 10 are busy
  connectionLimit: 10,        // max 10 simultaneous connections
  queueLimit: 0,              // unlimited queue
});
```

**How pool.execute() works:**
```
Your code:  pool.execute("SELECT * FROM users WHERE id = ?", [5])
                                                            ↑ values
Pool:       grabs one of 10 connections
MySQL:      runs the query safely (prepared statement)
Pool:       releases the connection back
Your code:  gets the result rows
```

**Why prepared statements? (the ? placeholder)**
```
DANGEROUS — SQL injection possible:
pool.query(`SELECT * FROM users WHERE email = '${email}'`)
// If email = "'; DROP TABLE users; --"  → disaster!

SAFE — prepared statement:
pool.execute("SELECT * FROM users WHERE email = ?", [email])
// mysql2 escapes the value automatically — injection impossible
```

---

## CHAPTER 5 — Middleware Explained (auth.ts)

```typescript
// Middleware = a function that runs BETWEEN request and handler
// It has 3 parameters: req, res, next

// Request lifecycle with middleware:
// Request arrives
//   → express.json()    (parse body)
//   → cors()            (check origin)
//   → protect()         (verify JWT)   ← our custom middleware
//   → route handler()   (do the work)
//   → send response

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // "Authorization: Bearer eyJhbGci..."

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token." });
    return; // STOP — don't call next()
  }

  const token = authHeader.split(" ")[1]; // remove "Bearer " prefix

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: 5, role: "admin" }
    next(); // CONTINUE — go to route handler
  } catch {
    res.status(401).json({ message: "Invalid token." });
  }
};
```

**Reviewer question: "How does the route know WHO is logged in?"**
Answer: The `protect` middleware decodes the JWT token and attaches `req.user = { id, role }` to the request object. Every route handler that runs after `protect` can read `req.user.id` to know which user made the request.

---

## CHAPTER 6 — JWT (JSON Web Token) Explained

```
TOKEN STRUCTURE:  eyJhbGci.eyJpZCI6NS.HMAC_SIGNATURE
                  ──────── ─────────── ───────────────
                  Header   Payload     Signature
                  (algo)   (your data) (tamper-proof seal)

PAYLOAD contains: { id: 5, role: "admin", exp: 1234567890 }
```

**How it works in your code:**

```typescript
// 1. LOGIN — generate token (auth.ts)
const token = jwt.sign(
  { id: user.id, role: user.role },  // payload (data inside token)
  process.env.JWT_SECRET,            // secret key (server only knows this)
  { expiresIn: "7d" }               // expires in 7 days
);
// Token is sent to frontend → stored in localStorage

// 2. EVERY PROTECTED REQUEST — verify token (middleware/auth.ts)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// jwt.verify() checks:
//   a) Was this signed with our JWT_SECRET? (authentic)
//   b) Is it still before the exp date? (not expired)
// If both pass → decoded = { id: 5, role: "admin" }
// If either fails → throws error → we return 401
```

**Reviewer question: "Why don't we store sessions in the database?"**
Answer: JWT is stateless — all the information (id, role, expiry) is inside the token itself. The server doesn't need to store anything. Every request is verified by just checking the signature with JWT_SECRET. This is faster and scales better.

---

## CHAPTER 7 — bcrypt (Password Hashing) Explained

```typescript
// NEVER store plain passwords. ALWAYS hash them.

// 1. WHEN CREATING USER — hash the password
const salt = await bcrypt.genSalt(10);
// salt = random string like "$2b$10$4pN4EjLt..."
// 10 = cost factor (how many times to run the hashing algorithm)
// Higher = more secure but slower. 10 is the standard.

const hashedPassword = await bcrypt.hash("SuperAdmin@123", salt);
// result = "$2b$10$4pN4EjLtBPQAC/lBNRJmRuFJCZA..."
// This is what gets stored in the database

// 2. WHEN LOGGING IN — compare plain with hash
const isMatch = await bcrypt.compare("SuperAdmin@123", hashedPassword);
// bcrypt runs the same algorithm on the plain password and compares
// returns true if they match, false if not
// IMPOSSIBLE to reverse the hash — that's the point
```

---

## CHAPTER 8 — The Route Pattern (every route follows this)

```typescript
// PATTERN: method, path, [middleware], async handler
router.post("/login", async (req: Request, res: Response): Promise<void> => {

  // Step 1: Read input from request
  const { email, password } = req.body;

  // Step 2: Validate input
  if (!email || !password) {
    res.status(400).json({ message: "Required." });
    return; // ALWAYS return after sending response
  }

  // Step 3: Database operation (inside try/catch for safety)
  const user = await UserModel.findByEmail(email);

  // Step 4: Business logic check
  if (!user) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  // Step 5: Send success response
  res.status(200).json({ token, user });
});
```

**HTTP Status Codes your code uses:**
| Code | Meaning | When you use it |
|---|---|---|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (new resource created) |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | No token or wrong password |
| 403 | Forbidden | Token valid but insufficient role |
| 404 | Not Found | Customer/user ID doesn't exist |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Unhandled exception |

---

## CHAPTER 9 — Dynamic SQL (how filtering works)

```typescript
// MongoDB equivalent: Customer.find({ status: "Lead", name: /priya/i })
// MySQL equivalent: Build the WHERE clause dynamically

async findAll(filters: { status?: string; search?: string }) {
  let sql = "SELECT * FROM customers";
  const conditions: string[] = [];
  const values: unknown[] = [];

  // Add conditions based on what was provided
  if (filters.status && filters.status !== "All") {
    conditions.push("status = ?");
    values.push(filters.status);
  }

  if (filters.search) {
    conditions.push("name LIKE ?");
    values.push(`%${filters.search}%`);
    //            ↑ % is wildcard in SQL (like .* in regex)
    // "%priya%" matches: "Priya Sharma", "sanpriya", "priya123"
  }

  // Join conditions: ["status = ?", "name LIKE ?"] → "status = ? AND name LIKE ?"
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " ORDER BY created_at DESC";

  const [rows] = await pool.execute(sql, values);
  // values array = [?, ?] values in same order as ? placeholders
  return rows as ICustomer[];
}
```

---

## CHAPTER 10 — How to Run Your Code

```bash
# 1. Install dependencies
npm install

# 2. Create the MySQL tables (run once)
npm run migrate

# 3. Create the SuperAdmin (run once)
npm run seed

# 4. Start the development server
npm run dev

# 5. Test in Postman:
POST   http://localhost:5000/api/auth/login
GET    http://localhost:5000/api/customers
POST   http://localhost:5000/api/customers
```

---

## CHAPTER 11 — Files and Their Purpose

```
crm-mysql/
├── src/
│   ├── config/
│   │   └── db.ts          → Creates MySQL connection pool. Exported as 'pool'.
│   │                         Every model imports pool and calls pool.execute()
│   │
│   ├── models/
│   │   ├── User.ts         → All SQL queries for the users table.
│   │   │                     UserModel.findByEmail(), .create(), .deleteById()...
│   │   └── Customer.ts     → All SQL queries for the customers table.
│   │                         CustomerModel.findAll(), .create(), .update()...
│   │
│   ├── middleware/
│   │   └── auth.ts         → protect() and superAdminOnly() functions.
│   │                         Runs before route handlers to verify JWT.
│   │
│   ├── routes/
│   │   ├── auth.ts         → /api/auth/login, /me, /logout
│   │   ├── customers.ts    → /api/customers (GET, POST, PUT, DELETE)
│   │   └── users.ts        → /api/users (SuperAdmin only)
│   │
│   └── index.ts            → Main entry point. Creates Express app,
│                             registers middleware, mounts routes, starts server.
│
├── migrate.ts              → CREATE TABLE statements. Run once.
├── seed.ts                 → Creates SuperAdmin. Run once.
├── .env                    → Secrets (never commit to GitHub!)
├── package.json            → Project dependencies and npm scripts
└── tsconfig.json           → TypeScript compiler settings
```

---

## CHAPTER 12 — Common Reviewer Questions & Answers

**Q: What is Express?**
A: Express is a Node.js framework for building HTTP servers. It makes it easy to define routes (URL + method combinations) and middleware. Without Express we'd have to manually parse URLs and HTTP methods from raw Node.js.

**Q: What is middleware?**
A: A function that runs between the HTTP request arriving and the route handler responding. `express.json()` parses the request body, `cors()` handles cross-origin requests, and our custom `protect()` verifies the JWT token.

**Q: Why do we use a connection pool instead of a single connection?**
A: If 100 users send requests at the same time and we only had 1 connection, 99 would wait. The pool keeps 10 connections open and ready, so up to 10 requests can hit the database simultaneously.

**Q: What is bcrypt and why not just store passwords as plain text?**
A: bcrypt is a one-way hashing algorithm. You cannot reverse a bcrypt hash to get the original password. If the database is hacked, attackers still can't login because they'd need the plain password, not the hash. bcrypt.compare() rehashes the attempt and checks if it matches.

**Q: What is COALESCE in the update query?**
A: `COALESCE(newValue, existingColumn)` returns the first non-null value. In the UPDATE query, if the user only sends `{ status: "Active" }` (not all fields), `COALESCE(null, name)` keeps the existing name instead of overwriting it with null. This enables partial updates.

**Q: Why do you use `pool.execute()` instead of `pool.query()`?**
A: `execute()` uses prepared statements — the SQL and values are sent separately, so MySQL escapes the values automatically. This prevents SQL injection attacks where malicious input could break or modify the SQL query.

**Q: What does `affectedRows` tell you?**
A: After UPDATE or DELETE, MySQL tells you how many rows were changed. If `affectedRows === 0`, it means no row matched the WHERE clause (the ID doesn't exist). We use this to return a 404 response.

**Q: What does `insertId` tell you?**
A: After INSERT, MySQL tells you the AUTO_INCREMENT ID it assigned to the new row. We use this to immediately fetch and return the newly created record.

---

*You wrote every line of this. You understand every line of this. Go ace your review.*
