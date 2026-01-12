import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from "@nestjs/common";
import { CreateSecretUseCase } from "../../application/use-cases/create-secret.use-case";
import { GetSecretUseCase } from "../../application/use-cases/get-secret.use-case";
import { CreateSecretDto } from "../../application/dtos/create-secret.dto";
import { SecretNotFoundException } from "../../domain/exceptions/secret.exception";

@Controller("vault")
export class VaultController {
  constructor(
    private readonly createSecretUseCase: CreateSecretUseCase,
    private readonly getSecretUseCase: GetSecretUseCase
  ) {}

  @Post("secrets")
  async createSecret(@Body() dto: CreateSecretDto): Promise<void> {
    await this.createSecretUseCase.execute(dto);
  }

  @Get("secrets/:key")
  async getSecret(@Param("key") key: string): Promise<{ value: string }> {
    try {
      const value = await this.getSecretUseCase.execute(key);
      return { value };
    } catch (error) {
      if (error instanceof SecretNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }
}
