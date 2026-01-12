import { Injectable, Inject } from "@nestjs/common";
import { ICryptoPort, I_CRYPTO_PORT } from "../../domain/ports/crypto.port";

@Injectable()
export class EncryptTextUseCase {
  constructor(@Inject(I_CRYPTO_PORT) private readonly cryptoPort: ICryptoPort) {}

  execute(text: string): { encrypted: string; iv: string } {
    return this.cryptoPort.encrypt(text);
  }
}
