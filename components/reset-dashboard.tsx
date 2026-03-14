"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function ResetDashboard() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const reset = async () => {
    setBusy(true);
    try {
      await fetch("/api/reset", { method: "POST" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant="ghost" size="sm" className="w-full" disabled={busy} onClick={reset}>
      Reset Dashboard
    </Button>
  );
}
