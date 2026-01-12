import { SecretEntity } from "../entities/secret.entity";

export const I_SECRET_REPOSITORY = "ISecretRepository";

export interface ISecretRepository {
  findByKey(key: string): Promise<SecretEntity | null>;
  save(secret: SecretEntity): Promise<void>;
  deleteByKey(key: string): Promise<void>;
}
