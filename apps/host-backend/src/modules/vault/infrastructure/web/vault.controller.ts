import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseFilters,
} from "@nestjs/common";
import { CreateSecretUseCase } from "../../application/use-cases/create-secret.use-case";
import { CreateSecretDto } from "../../application/dtos/create-secret.dto";
import { GetSecretUseCase } from "../../application/use-cases/get-secret.use-case";
import { VaultExceptionFilter } from "./vault.exception-filter";

@Controller("vault")
@UseFilters(VaultExceptionFilter)
export class VaultController {
  constructor(
    private readonly createSecretUseCase: CreateSecretUseCase,
    private readonly getSecretUseCase: GetSecretUseCase
  ) {}

  @Post("secrets")
  async createSecret(@Body() dto: CreateSecretDto) {
    const result = await this.createSecretUseCase.execute(dto);
    return {
      success: true,
      data: result,
    };
  }

  @Get("secrets/:key")
  async getSecret(@Param("key") key: string) {
    const result = await this.getSecretUseCase.execute(key);
    return {
      success: true,
      data: result,
    };
  }
}
