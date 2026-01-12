export enum SecretScope {
  GLOBAL = "GLOBAL",
  PLUGIN_SPECIFIC = "PLUGIN_SPECIFIC",
}

export interface Secret {
  id: number;
  key: string;
  encryptedValue: string;
  iv: string;
  scope: SecretScope;
  pluginId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
