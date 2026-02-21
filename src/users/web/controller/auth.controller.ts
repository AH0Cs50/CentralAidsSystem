import type {Request,Response,NextFunction} from "express";
import {JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN} from '../../../config/config.js'

//Dependencies==>(create instances of dependencies for all use cases and other objects used in controller function)
//services
import { AuthService, type AuthConfig } from "../../application/auth.service.js";;
//repos imported here
import { type IRefreshTokenRepository } from '../../domain/repositories/IrefreshToken.js'

//use_cases
import { SignUpUser } from "../../application/usecase/singUp.usecase.js";


//create dependencies 
const auth_config = {
  jwtSecret: JWT_SECRET,             
  jwtExpiresIn: JWT_EXPIRES_IN,         
  refreshSecret: JWT_REFRESH_SECRET,        
  refreshExpiresIn: JWT_REFRESH_EXPIRES_IN,
} as AuthConfig

//just for test need to make real instance 
const refresh_repo = {} as IRefreshTokenRepository;

//auth service need to inject config and refresh repo
export const authService = new AuthService(auth_config,refresh_repo); // this auth service instance injected for all object that need it 


export function singUp(req:Request,res:Response,next:NextFunction) {
    //create instance of use_case
}

export function singIN(req:Request,res:Response,next:NextFunction) {

}

export function singOut(req:Request,res:Response,next:NextFunction) {

}

export function verifyEmail (req:Request,res:Response,next:NextFunction) {
    //take toke query param
    //then call the use case
}

