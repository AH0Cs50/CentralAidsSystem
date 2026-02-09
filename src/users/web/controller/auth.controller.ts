import { type Request, type Response, type NextFunction, request, response } from "express";

//usecases
import { SignUpUser } from "../../application/usecase/singUp.usecase.js";


//create one instance of users repo to use it in all usecases

export function singUp(req:Request,res:Response,next:NextFunction) {
    //create instance of usecase
}

export function singIN(req:Request,res:Response,next:NextFunction) {

}

export function singOut(req:Request,res:Response,next:NextFunction) {

}

