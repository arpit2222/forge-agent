"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";

type ProjectFile = { path: string; content: string };

type ProjectPayload = {
  project: { id: string; title: string };
  files: ProjectFile[];
};

export default function ProjectCodeViewer({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [active, setActive] = useState<ProjectFile | null>(null);

  useEffect(() => {
    let activeFetch = true;
    const load = async () => {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = (await res.json()) as ProjectPayload;
      if (!activeFetch || !data?.files) return;
      setFiles(data.files);
      setActive(data.files[0] || null);
    };
    load();
    return () => {
      activeFetch = false;
    };
  }, [projectId]);

  const copy = async () => {
    if (!active) return;
    await navigator.clipboard.writeText(active.content);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
      <div className="rounded-3xl border border-ink/10 bg-white/80 p-4 shadow-glass">
        <div className="text-xs uppercase tracking-[0.2em] text-ink/60">Files</div>
        <ul className="mt-4 space-y-2 text-sm">
          {files.map((file) => (
            <li key={file.path}>
              <button
                className={`w-full rounded-xl px-3 py-2 text-left ${
                  active?.path === file.path
                    ? "bg-ember/10 text-ember"
                    : "hover:bg-ink/5"
                }`}
                onClick={() => setActive(file)}
              >
                {file.path}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-3xl border border-ink/10 bg-white/90 p-6 shadow-glass">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-ink/60">Selected File</div>
            <div className="text-sm font-semibold text-ink">{active?.path ?? ""}</div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={copy}>Copy Code</Button>
            <a
              className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-xs font-semibold text-canvas"
              href={`/api/projects/${projectId}/download`}
            >
              Download Zip
            </a>
          </div>
        </div>
        <pre className="mt-4 max-h-[520px] overflow-auto rounded-2xl bg-ink/5 p-4 text-xs text-ink/80">
{active?.content ?? ""}
        </pre>
      </div>
    </div>
  );
}
