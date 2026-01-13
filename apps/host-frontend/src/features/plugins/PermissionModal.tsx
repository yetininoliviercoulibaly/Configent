import { Shield, ShieldAlert, Globe, Bell, Lock } from "lucide-react";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";

export interface PluginPermission {
  id: string;
  name: string;
  description: string;
  critical: boolean;
  icon: "vault" | "network" | "notify";
}

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pluginName: string;
  version: string;
  permissions: PluginPermission[];
}

export function PermissionModal({
  isOpen,
  onClose,
  onConfirm,
  pluginName,
  version,
  permissions
}: PermissionModalProps) {
  
  const getIcon = (type: string, critical: boolean) => {
    switch (type) {
      case "vault":
        return <Lock className={critical ? "text-destructive" : "text-primary"} />;
      case "network":
        return <Globe className={critical ? "text-yellow-500" : "text-primary"} />;
      case "notify":
        return <Bell className="text-primary" />;
      default:
        return <Shield className="text-primary" />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Install Plugin: ${pluginName}`}>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Version: {version} • Verified Publisher
          </p>
          <p className="mt-2 text-sm">
            This plugin is requesting access to the following capabilities:
          </p>
        </div>

        <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Permissions Request
          </h3>
          {permissions.map((perm) => (
            <div key={perm.id} className="flex gap-4">
              <div className="mt-1 h-5 w-5 shrink-0">
                {getIcon(perm.icon, perm.critical)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{perm.name}</span>
                  {perm.critical && (
                    <ShieldAlert className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground italic">
                  {perm.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={onConfirm} className="w-full">
            Install & Grant Permissions
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>

        <p className="text-[10px] text-center text-muted-foreground">
          Code will be executed in a secure sandbox. Permissions can be revoked anytime in settings.
        </p>
      </div>
    </Modal>
  );
}
