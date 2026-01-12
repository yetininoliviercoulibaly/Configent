import { SecretScope } from "../vault.types";

export class SecretEntity {
  constructor(
    public readonly key: string,
    public readonly encryptedValue: string,
    public readonly iv: string,
    public readonly scope: SecretScope = SecretScope.GLOBAL,
    public readonly pluginId: string | null = null,
    public readonly id?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
