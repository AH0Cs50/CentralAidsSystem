//have all dependencies and shared objects that used in the app in one place to avoid circular dependencies and make it easy to manage and maintain the codebase

//config
//auth jwt config Vars
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from './config/config.js'
//SMTP config Vars

//services
//auth jwt token service
import type { TokenServiceConfig } from '../users/application/services/ITokenService.js';
import { TokenService } from "../users/infrastructure/services/token.service.js";
//password reset token service
import { ResetPasswordTokenService } from './../users/infrastructure/services/resetPassword.service.js'
//email service
import { type SMTPConfig } from "./../users/domain/services/IEmailService.js";
import { EmailService as Email } from '../users/infrastructure/services/email.service.js';
import { PasswordHasher } from '../users/infrastructure/services/passwordHash.service.js';

//repos imported here (use the implementation of the repository that you have in your infrastructure layer, here it's just a placeholder)
import { type IRefreshTokenRepository } from '../users/domain/repositories/IRefreshToken.repository.js'
import type { IUserRepository } from "../users/domain/repositories/IUser.repository.js";
import type { IPasswordResetTokenRepository } from '../users/domain/repositories/IResetPasswordRepository.js';



//create dependencies
const refresh_repo = {} as IRefreshTokenRepository;
const PasswordResetRepo = {} as IPasswordResetTokenRepository;
const userRepo = {} as IUserRepository;

const auth_config = {
  jwtSecret: JWT_SECRET,
  jwtExpiresIn: JWT_EXPIRES_IN,
  refreshSecret: JWT_REFRESH_SECRET,
  refreshExpiresIn: JWT_REFRESH_EXPIRES_IN,
} as TokenServiceConfig;

const tokenService = new TokenService(auth_config, refresh_repo); // this token service instance injected for all object that need it
const passwordHasher = new PasswordHasher(); // this password hasher instance injected for all object that need it
const ResetPassTokenService = new ResetPasswordTokenService(PasswordResetRepo, passwordHasher);

const SMTPconfig = {} as SMTPConfig;
const EmailService = new Email(SMTPconfig);


export {
  userRepo,
  refresh_repo,
  tokenService,
  ResetPassTokenService,
  EmailService,
  passwordHasher
}


