import { Router } from "express";
import {} from "express";
const authRouter = Router();
authRouter.post('/sign-up', (req, res, next) => {
});
authRouter.post('/sign-in', (req, res, next) => {
});
authRouter.post('/sign-out', (req, res, next) => {
});
authRouter.post('/password-reset', (req, res, next) => {
});
authRouter.get('/verify-email/:id', (req, res, next) => {
    //use query params called token have user token
});
export default authRouter;
