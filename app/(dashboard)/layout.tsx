import Link from "next/link";
import AgentControls from "@/components/agent-controls";
import PromptRunner from "@/components/prompt-runner";
import CleanupProjects from "@/components/cleanup-projects";
import ResetDashboard from "@/components/reset-dashboard";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Pipeline", href: "/pipeline" },
  { label: "Logs", href: "/logs" },
  { label: "Generated Projects", href: "/projects" }
];

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mesh">
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        <aside className="w-64 shrink-0">
          <div className="rounded-3xl bg-white/80 p-6 shadow-glass">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="ForgeAgent logo" className="h-10 w-10" />
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-ink/60">
                  ForgeAgent
                </div>
                <div className="mt-1 text-2xl font-display font-semibold">
                  Control Center
                </div>
              </div>
            </div>
            <nav className="mt-6 flex flex-col gap-2 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-transparent px-4 py-2 text-ink/80 transition hover:border-ink/20 hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <AgentControls />
            <PromptRunner />
            <div className="mt-4">
              <CleanupProjects />
            </div>
            <div className="mt-2">
              <ResetDashboard />
            </div>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
