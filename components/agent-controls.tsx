"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export default function AgentControls() {
  const [busy, setBusy] = useState(false);

  const run = async (path: string) => {
    setBusy(true);
    try {
      await fetch(path, { method: "POST" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-8 space-y-3">
      <Button size="sm" className="w-full" disabled={busy} onClick={() => run("/api/agent/start")}>
        Start Agent
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        disabled={busy}
        onClick={() => run("/api/agent/stop")}
      >
        Stop Agent
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        disabled={busy}
        onClick={() => run("/api/agent/demo")}
      >
        Run Demo Job
      </Button>
    </div>
  );
}
