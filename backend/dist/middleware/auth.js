import jwt from "jsonwebtoken";
export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ message: " No token provided. Access denied." });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid or expired token. " });
    }
};
//super admin only
export const superAdminOnly = (req, res, next) => {
    if (req.user?.role !== "superadmin") {
        res.status(403).json({ message: "access denied. SuperAdmin only." });
        return;
    }
    next();
};
