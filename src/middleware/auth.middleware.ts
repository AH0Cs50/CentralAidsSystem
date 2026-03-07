import type { Request, Response, NextFunction } from "express";
import { tokenService } from "../shared/container.js";
import type { TokenPayload } from "../users/application/services/ITokenService.js";

//addding user property to Request interface for TypeScript
declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload; // optional, will be set in middleware
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader: (string | undefined) = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ success: false, message: "No Token Provided" });

  const token: (string | undefined) = authHeader.split(" ")[1];//extract the token 
  if (!token) return res.status(401).json({ success: false, message: "Invalid Token Format" });

  const payload: TokenPayload = tokenService.verifyAccessToken(token);
  req.user = payload;
  next();
}