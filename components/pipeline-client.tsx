"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { PipelineState } from "../lib/types";

export default function PipelineClient() {
  const [pipeline, setPipeline] = useState<PipelineState>({ stages: [] });

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const res = await fetch("/api/state", { cache: "no-store" });
        const data = await res.json();
        if (active) setPipeline(data.pipeline);
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
    <div className="grid gap-4">
      {pipeline.stages.map((stage, index) => (
        <motion.div
          key={stage.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="rounded-3xl border border-ink/10 bg-white/80 p-6 shadow-glass"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/60">
                Stage {index + 1}
              </p>
              <h3 className="text-xl font-display font-semibold">{stage.name}</h3>
            </div>
            <span
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                stage.status === "done"
                  ? "bg-moss/15 text-moss"
                  : stage.status === "active"
                  ? "bg-ember/20 text-ember"
                  : stage.status === "error"
                  ? "bg-red-200 text-red-800"
                  : "bg-ink/5 text-ink/60"
              }`}
            >
              {stage.status}
            </span>
          </div>
          <p className="mt-3 text-sm text-ink/60">
            {stage.updatedAt ? `Updated ${stage.updatedAt}` : "Awaiting job..."}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
