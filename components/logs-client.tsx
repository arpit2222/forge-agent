"use client";

import { useEffect, useState } from "react";

export default function LogsClient() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const res = await fetch("/api/state");
        const data = await res.json();
        if (active) setLogs(data.logs ?? []);
      } catch {
        // ignore
      }
    };
    poll();
    const id = setInterval(poll, 2000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="rounded-3xl border border-ink/10 bg-ink text-canvas shadow-glass">
      <div className="border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.3em] text-canvas/70">
        Structured Logs
      </div>
      <div className="max-h-[420px] space-y-2 overflow-auto px-6 py-4 text-sm">
        {logs.length ? (
          logs.map((line, index) => (
            <div key={`${line}-${index}`} className="font-mono text-xs text-canvas/80">
              {line}
            </div>
          ))
        ) : (
          <div className="text-canvas/60">No logs yet.</div>
        )}
      </div>
    </div>
  );
}
