import LogsClient from "@/components/logs-client";

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white/80 p-8 shadow-glass">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/60">Logs</p>
        <h1 className="mt-4 text-3xl font-display font-semibold">Agent Log Stream</h1>
        <p className="mt-2 text-sm text-ink/70">
          Structured events from poller, generator, builder, and submission engine.
        </p>
      </header>
      <LogsClient />
    </div>
  );
}
