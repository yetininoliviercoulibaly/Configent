import { Controller, Get } from "@nestjs/common";

// TODO: Import from @configent/sdk once ESM/CommonJS interop is resolved
// For now, mirror the SDK version locally
const SDK_VERSION = "0.1.0";

interface IHealthResponse {
  status: string;
  timestamp: string;
  version: string;
  sdkVersion: string;
}

/**
 * Health check controller for monitoring and readiness probes.
 */
@Controller("health")
export class HealthController {
  @Get()
  check(): IHealthResponse {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "0.1.0",
      sdkVersion: SDK_VERSION,
    };
  }
}

