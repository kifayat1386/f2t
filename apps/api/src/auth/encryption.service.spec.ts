import { describe, it, expect, beforeEach } from 'vitest';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(() => {
    service = new EncryptionService();
  });

  it('should encrypt and decrypt a string securely', () => {
    const pii = 'NID: 1234567890';

    const encrypted = service.encrypt(pii);
    // Ciphertext should not contain the original string
    expect(encrypted.includes(pii)).toBe(false);

    const decrypted = service.decrypt(encrypted);
    expect(decrypted).toBe(pii);
  });

  it('should produce different ciphertexts for the same input due to IV', () => {
    const pii = 'Secret Data';

    const encrypted1 = service.encrypt(pii);
    const encrypted2 = service.encrypt(pii);

    expect(encrypted1).not.toBe(encrypted2);

    expect(service.decrypt(encrypted1)).toBe(pii);
    expect(service.decrypt(encrypted2)).toBe(pii);
  });

  it('should throw error on invalid ciphertext format', () => {
    expect(() => {
      service.decrypt('invalid-format-without-colon');
    }).toThrow('Invalid encrypted format');
  });
});
