import { Injectable, Inject } from "@nestjs/common";
import { ISecretRepository, I_SECRET_REPOSITORY } from "../../domain/ports/secret.repository.port";
import { ICryptoPort, I_CRYPTO_PORT } from "../../domain/ports/crypto.port";
import { CreateSecretDto } from "../dtos/create-secret.dto";
import { SecretEntity } from "../../domain/entities/secret.entity";
import { SecretScope } from "../../domain/vault.types";
import { SecretAlreadyExistsException } from "../../domain/exceptions/secret.exception";

@Injectable()
export class CreateSecretUseCase {
  constructor(
    @Inject(I_SECRET_REPOSITORY) private readonly secretRepository: ISecretRepository,
    @Inject(I_CRYPTO_PORT) private readonly cryptoPort: ICryptoPort
  ) {}

  async execute(dto: CreateSecretDto): Promise<SecretEntity> {
    const existing = await this.secretRepository.findByKey(dto.key);
    if (existing) {
      throw new SecretAlreadyExistsException(dto.key);
    }

    const { encrypted, iv } = this.cryptoPort.encrypt(dto.value);
    
    const secret = new SecretEntity(
      dto.key,
      encrypted,
      iv,
      dto.scope ?? SecretScope.GLOBAL,
      dto.pluginId ?? null
    );

    await this.secretRepository.save(secret);
    return secret;
  }
}
