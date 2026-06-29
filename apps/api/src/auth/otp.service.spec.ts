import { describe, it, expect, beforeEach } from 'vitest';
import { OtpService } from './otp.service';

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(() => {
    service = new OtpService();
  });

  it('should send and verify an OTP correctly', async () => {
    const phone = '+8801700000001';
    const code = await service.sendOtp(phone);

    // Using the correct code should verify
    const isValid = await service.verifyOtp(phone, code);
    expect(isValid).toBe(true);
  });

  it('should fail to verify with wrong code', async () => {
    const phone = '+8801700000002';
    await service.sendOtp(phone);

    // Using wrong code should fail
    const isValid = await service.verifyOtp(phone, '999999');
    expect(isValid).toBe(false);
  });

  it('should fail to verify if no OTP was sent', async () => {
    const isValid = await service.verifyOtp('+8801700000003', '123456');
    expect(isValid).toBe(false);
  });

  it('should burn OTP after single successful use', async () => {
    const phone = '+8801700000004';
    const code = await service.sendOtp(phone);

    // First verification succeeds
    let isValid = await service.verifyOtp(phone, code);
    expect(isValid).toBe(true);

    // Second verification should fail (burnt)
    isValid = await service.verifyOtp(phone, code);
    expect(isValid).toBe(false);
  });
});
