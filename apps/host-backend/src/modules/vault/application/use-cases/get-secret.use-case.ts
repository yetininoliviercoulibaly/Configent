import { Injectable, Inject } from "@nestjs/common";
import { ISecretRepository, I_SECRET_REPOSITORY } from "../../domain/ports/secret.repository.port";
import { ICryptoPort, I_CRYPTO_PORT } from "../../domain/ports/crypto.port";
import { SecretNotFoundException } from "../../domain/exceptions/secret.exception";

@Injectable()
export class GetSecretUseCase {
  constructor(
    @Inject(I_SECRET_REPOSITORY) private readonly secretRepository: ISecretRepository,
    @Inject(I_CRYPTO_PORT) private readonly cryptoPort: ICryptoPort
  ) {}

  async execute(key: string): Promise<string> {
    const secret = await this.secretRepository.findByKey(key);
    if (!secret) {
      throw new SecretNotFoundException(key);
    }

    return this.cryptoPort.decrypt(secret.encryptedValue, secret.iv);
  }
}
