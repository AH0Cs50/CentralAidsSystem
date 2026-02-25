import { HttpError } from "../../../shared/HttpError.js";
//dependencies
import { authService, userRepo } from "../../../shared/container.js";
//use_cases
import { SignUpUser } from "../../application/usecase/singUp.usecase.js";
import { verifyEmail as verifyEmailUsecase } from "../../application/usecase/verify_email.usecase.js";
export async function singUp(req, res, next) {
    const { first_name, last_name, email, password } = req.body;
    //create instance of use_case
    const signUpUser = new SignUpUser(userRepo); // inject the user repository to use case
    const user = await signUpUser.execute(first_name, last_name, email, password);
    return res.status(201).json({ success: true, message: 'User created successfully', user_data: user.getUserData() });
}
export function singIN(req, res, next) {
}
export function singOut(req, res, next) {
}
export async function verifyEmail(req, res, next) {
    try {
        const userId = req.params.id;
        if (!userId)
            throw new HttpError(400, 'User ID is required');
        const verifyEmailUseCase = new verifyEmailUsecase(userRepo);
        await verifyEmailUseCase.execute(userId);
        return res.status(200).json({ success: true, message: 'Email verified successfully' });
    }
    catch (error) {
        next(error);
    }
}
