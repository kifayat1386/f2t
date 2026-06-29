import * as jwt from 'jsonwebtoken';

export class JwtService {
  private accessSecret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
  private refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

  signAccessToken(payload: any): string {
    return jwt.sign(payload, this.accessSecret, { expiresIn: '15m' });
  }

  signRefreshToken(payload: any): string {
    return jwt.sign(payload, this.refreshSecret, { expiresIn: '30d' });
  }

  verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.accessSecret);
    } catch (e) {
      return null;
    }
  }

  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.refreshSecret);
    } catch (e) {
      return null;
    }
  }
}
