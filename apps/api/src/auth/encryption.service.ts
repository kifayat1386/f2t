import * as crypto from 'crypto';

export class EncryptionService {
  private algorithm = 'aes-256-cbc';
  // Secret should be strictly 32 bytes (256 bits). For demo we use a padded/truncated key.
  private secretKey: Buffer;

  constructor() {
    const secret = process.env.PII_ENCRYPTION_KEY || 'default_32_byte_dev_secret_key__';
    // Ensure key is 32 bytes
    this.secretKey = Buffer.from(secret.padEnd(32, '_').slice(0, 32), 'utf-8');
  }

  encrypt(text: string): string {
    // Generate a secure random Initialization Vector (16 bytes)
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);

    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    // Prepend the IV to the ciphertext so we can decrypt it later
    return `${iv.toString('hex')}:${encrypted}`;
  }

  decrypt(text: string): string {
    const parts = text.split(':');

    if (parts.length !== 2) {
      throw new Error('Invalid encrypted format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];

    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
  }
}
