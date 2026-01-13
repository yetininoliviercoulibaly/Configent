import { useRef, useEffect, useState } from "react";
import { cn } from "../lib/utils";

interface PluginHostProps {
  pluginId: string;
  src: string;
  className?: string;
  title?: string;
}

export function PluginHost({ pluginId, src, className, title }: PluginHostProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);

  // Function to send messages to the plugin (Reserved for future)
  // const sendMessage = (type: string, payload: any) => {
  //   if (iframeRef.current?.contentWindow) {
  //     iframeRef.current.contentWindow.postMessage({ type, payload }, "*");
  //   }
  // };

  useEffect(() => {
    // Listen for messages from the plugin
    const handleMessage = (event: MessageEvent) => {
      // Security Check: Verify origin? (In Phase 1 Localhost, origin is null/same)
      if (!event.data || typeof event.data !== "object") return;
      
      const { type, payload } = event.data;
      
      // TODO: Forward to Backend RPC via WebSocket/Post
      console.log(`[Plugin:${pluginId}] Message:`, type, payload);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [pluginId]);

  return (
    <div className={cn("flex flex-col h-full bg-card rounded-xl overflow-hidden border", className)}>
        {title && (
            <div className="bg-muted/50 px-4 py-2 text-xs font-semibold text-muted-foreground border-b">
                {title}
            </div>
        )}
      <div className="relative flex-1">
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-card">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
        )}
        <iframe
          ref={iframeRef}
          src={src}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-forms"
          onLoad={() => setLoading(false)}
          title={`Plugin: ${pluginId}`}
        />
      </div>
    </div>
  );
}
