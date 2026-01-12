import { Injectable, OnModuleInit } from "@nestjs/common";
import { ICryptoPort } from "../../domain/ports/crypto.port";
import { ConfigService } from "../../../../shared/config/config.service";
import * as crypto from "crypto";

@Injectable()
export class NodeCryptoAdapter implements ICryptoPort, OnModuleInit {
  private readonly algorithm = "aes-256-gcm";
  private masterKey: Buffer;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const secret =
      this.configService.get("CONFIGENT_MASTER_KEY") ||
      "default-dev-key-change-me!";
    // TODO: In production, this should be injected or managed via a robust configuration service
    this.masterKey = crypto.scryptSync(secret, "configent-salt", 32);
  }

  encrypt(text: string): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.masterKey, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");

    // We combine authTag and encrypted text into one string for storage simplicity
    // Format: authTag:encrypted
    return {
      encrypted: `${authTag}:${encrypted}`,
      iv: iv.toString("hex"),
    };
  }

  decrypt(encryptedValue: string, iv: string): string {
    const [authTag, encrypted] = encryptedValue.split(":");
    if (!authTag || !encrypted) {
      throw new Error("Invalid encrypted value format. Expected authTag:encrypted");
    }

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.masterKey,
      Buffer.from(iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}
