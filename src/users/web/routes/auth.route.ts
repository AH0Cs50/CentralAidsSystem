import { Router } from "express";
import { type Request,type Response, type NextFunction } from "express";

const authRouter = Router();

authRouter.post('/sign-up',(req:Request,res:Response,next:NextFunction)=>{

})

authRouter.post('/sign-in',(req:Request,res:Response,next:NextFunction)=>{

})

authRouter.post('/sign-out',(req:Request,res:Response,next:NextFunction)=>{

})

export default authRouter;