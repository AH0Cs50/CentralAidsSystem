import { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from '../../../config/config.js';
//Dependencies==>(create instances of dependencies for all use cases and other objects used in controller function)
//services
import { AuthService } from "../../application/auth.service.js";
;
//repos imported here
import {} from '../../domain/repositories/IrefreshToken.js';
//use_cases
import { SignUpUser } from "../../application/usecase/singUp.usecase.js";
//create dependencies 
const auth_config = {
    jwtSecret: JWT_SECRET,
    jwtExpiresIn: JWT_EXPIRES_IN,
    refreshSecret: JWT_REFRESH_SECRET,
    refreshExpiresIn: JWT_REFRESH_EXPIRES_IN,
};
//just for test need to make real instance 
const refresh_repo = {};
//auth service need to inject config and refresh repo
export const authService = new AuthService(auth_config, refresh_repo); // this auth service instance injected for all object that need it 
export function singUp(req, res, next) {
    //create instance of use_case
}
export function singIN(req, res, next) {
}
export function singOut(req, res, next) {
}
export function verifyEmail(req, res, next) {
    //take toke query param
    //then call the use case
}
