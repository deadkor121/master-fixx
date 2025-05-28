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
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Токен доступу відсутній" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Невірний токен доступу" });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
  } catch (error) {
    // Ignore invalid tokens for optional auth
  }

  next();
}