import PipelineClient from "@/components/pipeline-client";

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white/80 p-8 shadow-glass">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/60">Pipeline</p>
        <h1 className="mt-4 text-3xl font-display font-semibold">
          Live Agent Pipeline Visualization
        </h1>
        <p className="mt-2 text-sm text-ink/70">
          Each stage animates in real time as the agent receives and processes jobs.
        </p>
      </header>
      <PipelineClient />
    </div>
  );
}
