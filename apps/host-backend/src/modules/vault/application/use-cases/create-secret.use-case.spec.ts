import { Test, TestingModule } from "@nestjs/testing";
import { CreateSecretUseCase } from "./create-secret.use-case";
import { I_CRYPTO_PORT } from "../../domain/ports/crypto.port";
import { I_SECRET_REPOSITORY } from "../../domain/ports/secret.repository.port";
import { SecretAlreadyExistsException } from "../../domain/exceptions/secret.exception";
import { CreateSecretDto } from "../dtos/create-secret.dto";
import { SecretScope } from "../../domain/vault.types";

describe("CreateSecretUseCase", () => {
  let useCase: CreateSecretUseCase;
  let mockCryptoPort: any;
  let mockRepository: any;

  beforeEach(async () => {
    mockCryptoPort = {
      encrypt: jest.fn(),
      decrypt: jest.fn(),
    };
    mockRepository = {
      findByKey: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSecretUseCase,
        {
          provide: I_CRYPTO_PORT,
          useValue: mockCryptoPort,
        },
        {
          provide: I_SECRET_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateSecretUseCase>(CreateSecretUseCase);
  });

  it("should create a secret successfully", async () => {
    const dto: CreateSecretDto = {
      key: "KEY",
      value: "VALUE",
      scope: SecretScope.GLOBAL,
    };
    mockRepository.findByKey.mockResolvedValue(null);
    mockCryptoPort.encrypt.mockReturnValue({ encrypted: "encrypted", iv: "iv" });

    const result = await useCase.execute(dto);

    expect(mockRepository.findByKey).toHaveBeenCalledWith("KEY");
    expect(mockCryptoPort.encrypt).toHaveBeenCalledWith("VALUE");
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "KEY",
        encryptedValue: "encrypted",
        scope: SecretScope.GLOBAL,
      })
    );
    expect(result).toBeDefined();
  });

  it("should throw if secret already exists", async () => {
    const dto: CreateSecretDto = {
      key: "KEY",
      value: "VALUE",
      scope: SecretScope.GLOBAL,
    };
    mockRepository.findByKey.mockResolvedValue({ key: "KEY" });

    await expect(useCase.execute(dto)).rejects.toThrow(
      SecretAlreadyExistsException
    );
    // Should NOT call encrypt if exists
    expect(mockCryptoPort.encrypt).not.toHaveBeenCalled();
  });
});
