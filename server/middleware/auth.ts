import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    userType: string;
  };
}

export function generateToken(user: { id: number; email: string; userType: string }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Токен не надано" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Недійсний токен" });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
    } catch (error) {
      // Continue without auth if token is invalid
    }
  }
  
  next();
}