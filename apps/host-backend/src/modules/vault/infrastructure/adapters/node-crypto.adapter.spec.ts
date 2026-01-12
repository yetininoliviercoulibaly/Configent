import { Test, TestingModule } from "@nestjs/testing";
import { NodeCryptoAdapter } from "./node-crypto.adapter";
import { ConfigService } from "../../../../shared/config/config.service";

describe("NodeCryptoAdapter", () => {
  let adapter: NodeCryptoAdapter;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NodeCryptoAdapter,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("test-secret-key"),
          },
        },
      ],
    }).compile();

    adapter = module.get<NodeCryptoAdapter>(NodeCryptoAdapter);
    configService = module.get<ConfigService>(ConfigService);
    adapter.onModuleInit();
  });

  it("should encrypt and decrypt a string correctly", () => {
    const originalText = "super-secret-password";
    const { encrypted, iv } = adapter.encrypt(originalText);

    expect(encrypted).toBeDefined();
    expect(iv).toBeDefined();
    expect(encrypted).not.toBe(originalText);

    const decrypted = adapter.decrypt(encrypted, iv);
    expect(decrypted).toBe(originalText);
  });

  it("should generate different IVs for the same text", () => {
    const text = "repeat-me";
    const result1 = adapter.encrypt(text);
    const result2 = adapter.encrypt(text);

    expect(result1.encrypted).not.toBe(result2.encrypted);
    expect(result1.iv).not.toBe(result2.iv);
  });

  it("should verify valid authTag format", () => {
    const { encrypted, iv } = adapter.encrypt("test");
    const parts = encrypted.split(":");
    expect(parts.length).toBe(2); // authTag:ciphertext
  });
});
