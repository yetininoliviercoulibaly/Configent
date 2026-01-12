export const I_CRYPTO_PORT = Symbol("ICryptoPort");

export interface ICryptoPort {
  encrypt(text: string): { encrypted: string; iv: string };
  decrypt(encrypted: string, iv: string): string;
}
