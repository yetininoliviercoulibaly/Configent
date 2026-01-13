import { useState } from "react";
import { Upload, GitBranch, Plus, Package } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { PermissionModal, PluginPermission } from "./PermissionModal";

interface PluginStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PluginStore({ isOpen, onClose }: PluginStoreProps) {
  const [gitUrl, setGitUrl] = useState("");
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  
  // Mock metadata that would be extracted from the manifest
  const [activeManifest, setActiveManifest] = useState<{
    name: string;
    version: string;
    permissions: PluginPermission[];
  } | null>(null);

  const handleInstallClick = () => {
    // Simulated parsing of a plugin manifest
    const mockManifest = {
      name: "The Moderator",
      version: "1.0.2",
      permissions: [
        { 
          id: "vault:read", 
          name: "Vault Read", 
          description: "Access to secure vault for OpenAI API Key", 
          critical: true,
          icon: "vault" as const
        },
        { 
          id: "network:public", 
          name: "Network Access", 
          description: "Allows external network requests to WordPress", 
          critical: true,
          icon: "network" as const 
        },
        { 
          id: "ui:notify", 
          name: "Notifications", 
          description: "Can send status updates to your dashboard", 
          critical: false,
          icon: "notify" as const 
        }
      ]
    };
    
    setActiveManifest(mockManifest);
    setIsPermModalOpen(true);
  };

  const finalizeInstallation = () => {
    console.log("Installing plugin:", activeManifest?.name);
    setIsPermModalOpen(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Plugin Management">
        <div className="space-y-8">
          {/* Repository Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add New Agent
            </h3>
            
            <div className="grid gap-4">
              {/* Drag & Drop Area */}
              <div 
                className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                onClick={handleInstallClick}
              >
                <div className="p-3 rounded-full bg-accent">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Drop plugin ZIP or click to upload</p>
                  <p className="text-xs text-muted-foreground">Manifest.json must be present</p>
                </div>
              </div>

              {/* Git URL Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground ml-1">Install from Git URL</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="https://github.com/configent/plugin-example"
                      className="w-full bg-muted/50 rounded-md py-2 pl-9 pr-4 text-sm outline-none border focus:border-primary transition-colors"
                      value={gitUrl}
                      onChange={(e) => setGitUrl(e.target.value)}
                    />
                  </div>
                  <Button size="sm" onClick={handleInstallClick} disabled={!gitUrl}>
                    Install
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Installed Plugins Section (Mini-list for Context) */}
          <div className="space-y-4">
             <h3 className="text-sm font-semibold flex items-center gap-2">
              <Package className="h-4 w-4" /> Installed (2)
            </h3>
            <div className="space-y-2">
               <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/10">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center">
                       <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">The Editor</div>
                      <div className="text-[10px] text-muted-foreground">v1.2.0 • Enabled</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Stop</Button>
               </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Permissions Modal Integration */}
      {activeManifest && (
        <PermissionModal
          isOpen={isPermModalOpen}
          onClose={() => setIsPermModalOpen(false)}
          onConfirm={finalizeInstallation}
          pluginName={activeManifest.name}
          version={activeManifest.version}
          permissions={activeManifest.permissions}
        />
      )}
    </>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
