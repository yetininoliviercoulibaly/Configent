import { Module } from "@nestjs/common";
import { VaultController } from "./infrastructure/web/vault.controller";
import { CreateSecretUseCase } from "./application/use-cases/create-secret.use-case";
import { GetSecretUseCase } from "./application/use-cases/get-secret.use-case";
import { EncryptTextUseCase } from "./application/use-cases/encrypt-text.use-case";
import { I_SECRET_REPOSITORY } from "./domain/ports/secret.repository.port";
import { DrizzleSecretRepository } from "./infrastructure/persistence/drizzle-secret.repository";
import { I_CRYPTO_PORT } from "./domain/ports/crypto.port";
import { NodeCryptoAdapter } from "./infrastructure/adapters/node-crypto.adapter";
import { DatabaseModule } from "../../shared/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [VaultController],
  providers: [
    CreateSecretUseCase,
    GetSecretUseCase,
    EncryptTextUseCase,
    {
      provide: I_SECRET_REPOSITORY,
      useClass: DrizzleSecretRepository,
    },
    {
      provide: I_CRYPTO_PORT,
      useClass: NodeCryptoAdapter,
    },
  ],
  exports: [GetSecretUseCase, EncryptTextUseCase], // Export UseCases directly or via Proxy if needed for other modules
})
export class VaultModule {}
