"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { GeneratedProject } from "../lib/types";
import { Button } from "./ui/button";

export default function ProjectsClient() {
  const [projects, setProjects] = useState<GeneratedProject[]>([]);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const res = await fetch("/api/state");
        const data = await res.json();
        if (active) setProjects(data.projects ?? []);
      } catch {
        // ignore
      }
    };
    poll();
    const id = setInterval(poll, 4000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <div
          key={project.id}
          className="rounded-3xl border border-ink/10 bg-white/80 p-6 shadow-glass"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/60">
                {project.promptType}
              </p>
              <h3 className="mt-2 text-xl font-display font-semibold">
                {project.title}
              </h3>
            </div>
            <span className="rounded-full bg-ink/5 px-3 py-1 text-xs uppercase">
              {new Date(project.createdAt).toLocaleTimeString()}
            </span>
          </div>
          <p className="mt-3 text-sm text-ink/70">{project.description}</p>
          <div className="mt-4 rounded-2xl bg-ink/5 p-4 text-xs text-ink/70">
            <div className="mb-2 text-[10px] uppercase tracking-[0.2em]">
              File Tree
            </div>
            <ul className="space-y-1 font-mono">
              {project.fileTree.slice(0, 8).map((file) => (
                <li key={file}>{file}</li>
              ))}
              {project.fileTree.length > 8 && <li>...</li>}
            </ul>
          </div>
          <div className="mt-4 rounded-2xl border border-ink/10 bg-white/70 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink/60">
              Preview
            </div>
            <pre className="mt-2 max-h-40 overflow-auto text-xs text-ink/70">
{project.preview}
            </pre>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Link href={`/projects/${project.id}`}>
              <Button size="sm">Project Code</Button>
            </Link>
            <a
              className="text-xs uppercase tracking-[0.2em] text-ember"
              href={`/api/projects/${project.id}/download`}
            >
              Download Zip
            </a>
          </div>
        </div>
      ))}
      {!projects.length && (
        <div className="rounded-3xl border border-ink/10 bg-white/80 p-6 shadow-glass">
          <p className="text-sm text-ink/70">No generated projects yet.</p>
        </div>
      )}
    </div>
  );
}
