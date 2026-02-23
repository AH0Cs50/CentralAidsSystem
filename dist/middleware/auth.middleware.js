import { authService } from "../users/web/controller/auth.controller.js";
export function authMiddleWare() {
    //wrapping middleware to use other dependencies like auth service 
    return function authMiddleWare(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader)
            return res.status(401).json({ success: false, message: "No Token Provided" });
        const token = authHeader.split(" ")[1]; //extract the token 
        if (!token)
            return res.status(401).json({ success: false, message: "Invalid Token Format" });
        const payload = authService.verifyAccessToken(token);
        req.user = payload;
        next();
    };
}
