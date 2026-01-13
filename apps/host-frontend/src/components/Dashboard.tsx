import { useState } from "react";
import { cn } from "../lib/utils";
import { Settings, AlertTriangle, ShieldCheck, Plus } from "lucide-react";
import { PluginStore } from "../features/plugins/PluginStore";
import { Button } from "./ui/Button";

interface WidgetProps {
  className?: string;
  title: string;
  children: React.ReactNode;
}

function WidgetCard({ className, title, children }: WidgetProps) {
  return (
    <div className={cn("bg-card text-card-foreground rounded-xl border p-4 shadow-sm", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function Dashboard() {
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      {/* Top Bar */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary"></div>
          <h1 className="text-xl font-bold tracking-tight">Configent</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-2"
            onClick={() => setIsStoreOpen(true)}
          >
            <Plus className="h-4 w-4" /> Install Plugin
          </Button>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            Context: Localhost
          </span>
          <button className="rounded-full p-2 hover:bg-accent">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2">
        
        {/* Widget 1: Editor (Large 2x2) */}
        <WidgetCard title="The Editor - Journal" className="md:col-span-2 md:row-span-2">
          <div className="flex h-full flex-col">
            <div className="mb-2 flex gap-2 border-b pb-2 text-muted-foreground">
              <span className="cursor-pointer hover:text-foreground">B</span>
              <span className="cursor-pointer hover:text-foreground">I</span>
              <span className="cursor-pointer hover:text-foreground">Link</span>
            </div>
            <textarea 
              className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Today's Entry... What did you achieve?"
            ></textarea>
          </div>
        </WidgetCard>

        {/* Widget 2: System Status (1x1) */}
        <WidgetCard title="System Status" className="md:col-span-1">
          <div className="flex flex-col items-center justify-center gap-2 py-4">
             <ShieldCheck className="h-12 w-12 text-green-500" />
             <span className="text-sm font-medium text-green-500">All Systems Normal</span>
             <div className="mt-2 text-xs text-muted-foreground">CPU: 12% | RAM: 340MB</div>
          </div>
        </WidgetCard>

        {/* Widget 3: Moderator (1x1) */}
        <WidgetCard title="Moderator" className="md:col-span-1">
           <div className="flex flex-col items-center justify-center gap-2 py-4">
             <div className="relative">
                <AlertTriangle className="h-12 w-12 text-yellow-500" />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">4</span>
             </div>
             <div className="text-center">
                <div className="text-2xl font-bold">4</div>
                <div className="text-xs text-muted-foreground">Pending Comments</div>
             </div>
           </div>
        </WidgetCard>

        {/* Widget 4: Recent Activity (Wide 2x1) */}
        <WidgetCard title="Recent Activity" className="md:col-span-2">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex gap-2">
              <span className="text-primary">[Moderator]</span> Flagged comment id#123 as Toxic
            </div>
            <div className="flex gap-2">
              <span className="text-primary">[System]</span> Plugin "The Editor" updated to v1.0.2
            </div>
            <div className="flex gap-2">
              <span className="text-primary">[Editor]</span> Scheduled "Daily Briefing" for 08:00 AM
            </div>
          </div>
        </WidgetCard>

      </div>

      {/* Feature Modals */}
      <PluginStore 
        isOpen={isStoreOpen} 
        onClose={() => setIsStoreOpen(false)} 
      />
    </div>
  );
}
