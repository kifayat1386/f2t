import { describe, it, expect, beforeEach } from 'vitest';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(() => {
    service = new JwtService();
  });

  it('should sign and verify access token', () => {
    const payload = { sub: 'user_123', role: 'BUYER' };
    const token = service.signAccessToken(payload);

    expect(typeof token).toBe('string');

    const decoded = service.verifyAccessToken(token);
    expect(decoded.sub).toBe('user_123');
    expect(decoded.role).toBe('BUYER');
  });

  it('should return null for invalid access token', () => {
    const decoded = service.verifyAccessToken('invalid.token.string');
    expect(decoded).toBeNull();
  });

  it('should sign and verify refresh token', () => {
    const payload = { sub: 'user_123' };
    const token = service.signRefreshToken(payload);

    const decoded = service.verifyRefreshToken(token);
    expect(decoded.sub).toBe('user_123');
  });
});
