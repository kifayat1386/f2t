export class OtpService {
  // Simple in-memory mock store for OTPs: phone -> { code, expiresAt }
  private store = new Map<string, { code: string; expiresAt: number }>();

  async sendOtp(phone: string): Promise<string> {
    // In a real app, this generates a random 6 digit number
    // and calls SMS gateway. Here we mock it or use bypass.
    const code = process.env.OTP_BYPASS || '123456';

    // Set 5 minute expiration
    const expiresAt = Date.now() + 5 * 60 * 1000;

    this.store.set(phone, { code, expiresAt });

    // In dev mode, we might console.log the code, but we just return it here for testing
    return code;
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const record = this.store.get(phone);

    if (!record) {
      return false; // No OTP sent for this phone
    }

    if (Date.now() > record.expiresAt) {
      this.store.delete(phone);
      return false; // Expired
    }

    if (record.code === code) {
      this.store.delete(phone); // Burn OTP after successful use
      return true;
    }

    return false;
  }

  // Test util to clear state
  clear() {
    this.store.clear();
  }
}
