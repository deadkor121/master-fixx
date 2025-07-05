// middleware/cache.ts
import { Request, Response, NextFunction } from "express";
export function cache(seconds: number) {
    return (_req: Request, res: Response, next: NextFunction) => {
      res.setHeader("Cache-Control", `public, max-age=${seconds}`);
      next();
    };
  }
  