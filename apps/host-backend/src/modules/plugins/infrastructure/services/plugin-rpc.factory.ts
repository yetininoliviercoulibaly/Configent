import { Injectable, Logger } from "@nestjs/common";
import type { IRpcHandler } from "@configent/sandbox";
import type { PermissionScope } from "@configent/sdk";
import type { IPluginRpcFactory } from "../../domain/ports/rpc-factory.port";
import { RegisterTaskUseCase } from "../../../scheduler/application/use-cases/register-task.use-case";

@Injectable()
export class PluginRpcFactory implements IPluginRpcFactory {
  private readonly logger = new Logger(PluginRpcFactory.name);

  constructor(
    private readonly registerTaskUseCase: RegisterTaskUseCase,
  ) {}

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
    "notify.send": {
      scope: "ui:notify",
      handler: (level: string, message: string) => {
        this.logger.log(`RPC [notify.send] (${level}): ${message}`);
        return true;
      },
    },
    // MCP RPCs
    "mcp.call": {
      scope: "mcp:call",
      handler: (server: string, method: string, params: any) => {
        this.logger.log(`RPC [mcp.call] server=${server}, method=${method}`);
        
        // Mock WordPress MCP for US-303
        if (server === "wordpress" && method === "get_comments") {
          return [
            { id: 1, author: "Alice", content: "Great article!", toxic: false },
            { id: 2, author: "Bot", content: "BUY CRYPTO NOW!!!", toxic: true },
            { id: 3, author: "Bob", content: "I disagree with the premise.", toxic: false },
          ];
        }
        
        return [];
      },
    },
  };

  createRpc(pluginId: string, allowedScopes: PermissionScope[]): IRpcHandler {
    const rpc: IRpcHandler = {};
    const scopeSet = new Set(allowedScopes);

    // Bind specific handlers that need pluginId context
    const boundHandlers: Record<string, { scope: PermissionScope; handler: Function }> = {
      ...this.allHandlers,
      "scheduler.register": {
        scope: "schedule:register",
        handler: async (cron: string, handlerId: string) => {
          this.logger.log(`RPC [scheduler.register] called by ${pluginId} with cron=${cron}, handler=${handlerId}`);
          await this.registerTaskUseCase.execute(pluginId, cron, handlerId);
        },
      },
    };

    for (const [methodName, config] of Object.entries(boundHandlers)) {
      if (scopeSet.has(config.scope)) {
        rpc[methodName] = config.handler as any;
      }
    }

    return rpc;
  }
}
