export const I_CRYPTO_PORT = "ICryptoPort";

export interface ICryptoPort {
  encrypt(text: string): { encrypted: string; iv: string };
  decrypt(encrypted: string, iv: string): string;
}
