import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@/libs/global';

import { UnauthorizedError } from 'routing-controllers';
@Service()
export class AuthHelper {
  private readonly jwtSecret: string;

  constructor(private readonly config: ConfigService) {
    this.jwtSecret = this.config.get('JWT_SECRET');
  }

  validateAndDecodeToken(token: string): string {
    const validatedToken = jwt.verify(token, this.jwtSecret);
    if (!validatedToken) {
      throw new UnauthorizedError('Invalid token, send valid token');
    }

    const decodedToken = jwt.decode(token) as { sub?: string } | null;
    if (!decodedToken || !decodedToken.sub) {
      throw new UnauthorizedError('Invalid token, send valid token');
    }

    return decodedToken.sub;
  }

  generateToken(userId: string, expiresIn?: string): string {
    return jwt.sign({ sub: userId }, this.jwtSecret, {
      expiresIn: expiresIn || '1h'
    });
  }
}