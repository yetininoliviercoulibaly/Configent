import { Injectable, Logger } from "@nestjs/common";
import type { IRpcHandler } from "@configent/sandbox";
import type { PermissionScope } from "@configent/sdk";
import type { IPluginRpcFactory } from "../../domain/ports/rpc-factory.port";

@Injectable()
export class PluginRpcFactory implements IPluginRpcFactory {
  private readonly logger = new Logger(PluginRpcFactory.name);

  // In a real app, these would be injected services
  private readonly allHandlers: Record<string, { scope: PermissionScope; handler: Function }> = {
    // Vault RPCs
    "vault.getSecret": {
      scope: "vault:read",
      handler: (key: string) => {
        this.logger.log(`RPC [vault.getSecret] called with key=${key}`);
        return "secret-value-from-rpc"; // Mock implementation
      },
    },
    // Network RPCs
    "network.fetch": {
      scope: "network:public",
      handler: (url: string) => {
        this.logger.log(`RPC [network.fetch] called with url=${url}`);
        return { status: 200, body: "ok" };
      },
    },
    // Notification RPCs
    "ui.notify": {
      scope: "ui:notify",
      handler: (message: string) => {
        this.logger.log(`RPC [ui.notify] called with message=${message}`);
        return true;
      },
    },
  };

  createRpc(allowedScopes: PermissionScope[]): IRpcHandler {
    const rpc: IRpcHandler = {};
    const scopeSet = new Set(allowedScopes);

    for (const [methodName, config] of Object.entries(this.allHandlers)) {
      if (scopeSet.has(config.scope)) {
        rpc[methodName] = config.handler as any;
      }
    }

    return rpc;
  }
}
