import { Test, TestingModule } from "@nestjs/testing";
import { GetSecretUseCase } from "./get-secret.use-case";
import { I_SECRET_REPOSITORY } from "../../domain/ports/secret.repository.port";
import { I_CRYPTO_PORT } from "../../domain/ports/crypto.port";
import { SecretNotFoundException } from "../../domain/exceptions/secret.exception";

describe("GetSecretUseCase", () => {
  let useCase: GetSecretUseCase;
  let mockRepository: any;
  let mockCryptoPort: any;

  beforeEach(async () => {
    mockRepository = {
      findByKey: jest.fn(),
    };
    mockCryptoPort = {
      decrypt: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSecretUseCase,
        {
          provide: I_SECRET_REPOSITORY,
          useValue: mockRepository,
        },
        {
          provide: I_CRYPTO_PORT,
          useValue: mockCryptoPort,
        },
      ],
    }).compile();

    useCase = module.get<GetSecretUseCase>(GetSecretUseCase);
  });

  it("should return decrypted value", async () => {
    mockRepository.findByKey.mockResolvedValue({
      key: "KEY",
      encryptedValue: "tag:content",
      iv: "iv",
    });
    mockCryptoPort.decrypt.mockReturnValue("decrypted");

    const result = await useCase.execute("KEY");

    expect(mockRepository.findByKey).toHaveBeenCalledWith("KEY");
    expect(mockCryptoPort.decrypt).toHaveBeenCalledWith("tag:content", "iv");
    expect(result).toBe("decrypted");
  });

  it("should throw if secret not found", async () => {
    mockRepository.findByKey.mockResolvedValue(null);

    await expect(useCase.execute("KEY")).rejects.toThrow(
      SecretNotFoundException
    );
  });
});
