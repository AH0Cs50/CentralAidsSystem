//have all dependencies and shared objects that used in the app in one place to avoid circular dependencies and make it easy to manage and maintain the codebase

//config
import {JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN} from './config/config.js'


//services
import { TokenService, type TokenServiceConfig } from "../users/infrastructure/services/token.service.js";

//repos imported here (use the implementation of the repository that you have in your infrastructure layer, here it's just a placeholder)
import { type IRefreshTokenRepository } from '../users/domain/repositories/IrefreshToken.repository.js'
import type { IUserRepository } from "../users/domain/repositories/Iuser.repository.js";


//create dependencies

const refresh_repo = {} as IRefreshTokenRepository;
const userRepo = {} as IUserRepository;


const auth_config = {
  jwtSecret: JWT_SECRET,             
  jwtExpiresIn: JWT_EXPIRES_IN,         
  refreshSecret: JWT_REFRESH_SECRET,        
  refreshExpiresIn: JWT_REFRESH_EXPIRES_IN,
} as TokenServiceConfig;

const tokenService = new TokenService(auth_config,refresh_repo); // this token service instance injected for all object that need it

export {
    userRepo,
    refresh_repo,
    tokenService,
}


