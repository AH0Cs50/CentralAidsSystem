// middleware/authorize.ts
import type { Request, Response, NextFunction } from "express";
import { Role } from "../shared/types.js";

export const authorize = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Assuming the token is already verified and user info is attached to req.user
            const userRole = req.user?.role;

            if (!userRole || !allowedRoles.includes(userRole)) {
                return res.status(403).json({ message: "Forbidden: You don't have permission to access this resource" });
            }
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    };
};

