import type { PromptType } from "../lib/types";

const typeRules: { type: PromptType; keywords: string[] }[] = [
  { type: "Landing page", keywords: ["landing", "marketing", "hero"] },
  { type: "Dashboard", keywords: ["dashboard", "analytics", "metrics"] },
  { type: "AI tool", keywords: ["ai", "assistant", "llm", "agent"] },
  { type: "SaaS platform", keywords: ["saas", "subscription", "multi-tenant"] },
  { type: "API backend", keywords: ["api", "backend", "rest"] }
];

export function interpretPrompt(prompt: string) {
  const normalized = prompt.toLowerCase();
  const scored = typeRules.map((rule) => ({
    type: rule.type,
    score: rule.keywords.reduce(
      (acc, keyword) => (normalized.includes(keyword) ? acc + 1 : acc),
      0
    )
  }));
  const sorted = scored.sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  return {
    type: (winner?.score ?? 0) > 0 ? winner.type : "SaaS platform",
    confidence: winner?.score ?? 0
  };
}
