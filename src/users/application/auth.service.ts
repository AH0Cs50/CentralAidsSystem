// src/application/services/AuthService.ts
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from '../../shared/HttpError.js'
import type { StringValue } from "ms"; //string value type for ms library, to ensure correct typing for expiresIn

import { RefreshTokenEntry } from "../domain/entities/RefreshToken.entitiy.js";
import type {IRefreshTokenRepository} from '../domain/repositories/IrefreshToken.js';

/**
 * Payload for JWT tokens
*/

//consider as token payload type for both access and refresh tokens, can be extended with more fields as needed (e.g. role, permissions)
export interface TokenPayload {
  sub: string; // user id
  email: string;
  role: string;
  status: string;
}

/**
 * AuthService configuration
 */
export interface AuthConfig {
  jwtSecret: string;             // secret for access token
  jwtExpiresIn: string;          // e.g. "15m"
  refreshSecret: string;         // secret for refresh token
  refreshExpiresIn: string;      // e.g. "7d"
}

/**
 * General-purpose AuthService
 */
export class AuthService {
  private refreshTokens: Map<string, RefreshTokenEntry> = new Map(); //in memory refresh token store, can be replaced with a repository for persistence or live in Redis for distributed systems

  constructor(private readonly config: AuthConfig,
    private readonly refreshTokenRepo: IRefreshTokenRepository ) {}
  // ----------------------------
  // ACCESS TOKEN
  // ----------------------------
  createAccessToken(payload: TokenPayload): string {
    const expiresIn: StringValue = this.config.jwtExpiresIn as StringValue;
    return jwt.sign(payload, this.config.jwtSecret,{expiresIn});
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.config.jwtSecret) as TokenPayload;
    } catch {
      throw new HttpError(401, "Invalid or expired access token");
    }
  }

  // ----------------------------
  // REFRESH TOKEN
  // ----------------------------
  createRefreshToken(userId: string,role:string): string {
    const expiresIn: StringValue = this.config.refreshExpiresIn as StringValue;
    
    const token = jwt.sign({ sub: userId, role }, this.config.refreshSecret , {
     expiresIn,
      jwtid: uuidv4(), //jti
    });

    const decoded = jwt.decode(token) as { jti: string; exp: number } | null;
        if (!decoded || !decoded.jti || !decoded.exp) {
            throw new Error("Failed to decode refresh token");
    }

    const expiresAtDate = new Date(decoded.exp * 1000);

    const refreshTokenEntity = new RefreshTokenEntry(
    decoded.jti,
    token, 
    userId,
    expiresAtDate,
    false 
    );

    this.refreshTokens.set(token, refreshTokenEntity);
    this.refreshTokenRepo.save(refreshTokenEntity).catch (()=>{
     throw new HttpError (500, "the refresh token not stored in db"); 
     // you can revoked here also and delete from refresh tokens memory in map 
    })

    return token;
  }

  private async getRefreshToken (token:string ):Promise<RefreshTokenEntry> {
    let stored:RefreshTokenEntry | undefined  = this.refreshTokens.get(token);
     if (!stored ) {
      stored = await this.refreshTokenRepo.findByToken(token);
      if(stored){
        this.refreshTokens.set(token,stored);
      }else {
        throw new HttpError(401, "Refresh token revoked or invalid");
      }
    }
    return stored;
  }

  async verifyRefreshToken(token: string): Promise<string>  {
   
    let stored= await this.getRefreshToken(token);

    if(stored.revoked) {
      throw new HttpError (401,"Refresh token revoked or invalid");
    }

    try {
      const payload = jwt.verify(token, this.config.refreshSecret) as { sub: string };
      return payload.sub ;
    } catch {
      throw new HttpError(401, "Invalid or expired refresh token");
    }
  }

  async revokeRefreshToken(token: string) {
    const stored = await this.getRefreshToken(token);
    if (stored) {
      stored.revoked = true;
      this.refreshTokens.set(token, stored);
    }
  }

  
}
