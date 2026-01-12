import { IsString, IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { SecretScope } from "../../domain/vault.types";

export class CreateSecretDto {
  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsString()
  @IsNotEmpty()
  value!: string; // Plain text value to be encrypted

  @IsEnum(SecretScope)
  @IsOptional()
  scope?: SecretScope;

  @IsString()
  @IsOptional()
  pluginId?: string;
}
