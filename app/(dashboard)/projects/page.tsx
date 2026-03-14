import ProjectsClient from "@/components/projects-client";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white/80 p-8 shadow-glass">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
          Generated Projects
        </p>
        <h1 className="mt-4 text-3xl font-display font-semibold">
          Generated App Preview
        </h1>
        <p className="mt-2 text-sm text-ink/70">
          Inspect file trees, read generated descriptions, and preview the output.
        </p>
      </header>
      <ProjectsClient />
    </div>
  );
}
