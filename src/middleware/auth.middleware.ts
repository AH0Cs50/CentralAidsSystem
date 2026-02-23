import type { Request, Response, NextFunction  } from "express";
import { authService } from "../users/web/controller/auth.controller.js";
import type { TokenPayload } from "../users/application/auth.service.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload; // optional, will be set in middleware
  }
}

export function authMiddleWare ():Function {
    //wrapping middleware to use other dependencies like auth service 
    return function authMiddleWare (req:Request, res:Response, next:NextFunction) {
        const authHeader:(string | undefined) = req.headers['authorization'];
        if(!authHeader) return res.status(401).json({success:false,message:"No Token Provided"});

        const token:(string | undefined) = authHeader.split(" ")[1];//extract the token 
        if(!token) return res.status(401).json({success:false,message:"Invalid Token Format"});

        const payload:TokenPayload = authService.verifyAccessToken(token);
        req.user=payload;
        next();
    }
}