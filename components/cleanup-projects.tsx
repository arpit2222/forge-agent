"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function CleanupProjects() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const cleanup = async () => {
    setBusy(true);
    try {
      await fetch("/api/projects/cleanup", { method: "POST" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant="ghost" size="sm" className="w-full" disabled={busy} onClick={cleanup}>
      Clear Projects
    </Button>
  );
}
