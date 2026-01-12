/**
 * Permission scopes that plugins can request.
 * These follow an Android-style permission model.
 */
export type PermissionScope =
  | "vault:read"
  | "network:public"
  | "storage:read"
  | "storage:write"
  | "ui:notify"
  | "schedule:register"
  | "mcp:call";

/**
 * All available permission scopes as a constant array.
 * Useful for validation and iteration.
 */
export const PERMISSION_SCOPES: readonly PermissionScope[] = [
  "vault:read",
  "network:public",
  "storage:read",
  "storage:write",
  "ui:notify",
  "schedule:register",
  "mcp:call",
] as const;

/**
 * Checks if a string is a valid permission scope.
 */
export function isValidPermission(value: string): value is PermissionScope {
  return PERMISSION_SCOPES.includes(value as PermissionScope);
}
