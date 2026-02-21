import { authService } from "../users/web/controller/auth.controller.js";
import { HttpError } from "../shared/HttpError.js";
export function authMiddleWare() {
    //wrapping middleware to use other dependencies like auth service 
    return function authMiddleWare(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
        }
    };
}
