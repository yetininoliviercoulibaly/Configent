import { Test, TestingModule } from "@nestjs/testing";
import { EncryptTextUseCase } from "./encrypt-text.use-case";
import { I_CRYPTO_PORT } from "../../domain/ports/crypto.port";

describe("EncryptTextUseCase", () => {
  let useCase: EncryptTextUseCase;
  let mockCryptoPort: any;

  beforeEach(async () => {
    mockCryptoPort = {
      encrypt: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptTextUseCase,
        {
          provide: I_CRYPTO_PORT,
          useValue: mockCryptoPort,
        },
      ],
    }).compile();

    useCase = module.get<EncryptTextUseCase>(EncryptTextUseCase);
  });

  it("should encrypt text", () => {
    const text = "hello";
    const encrypted = { encrypted: "encrypted", iv: "iv" };
    mockCryptoPort.encrypt.mockReturnValue(encrypted);

    const result = useCase.execute(text);

    expect(mockCryptoPort.encrypt).toHaveBeenCalledWith(text);
    expect(result).toEqual(encrypted);
  });
});
