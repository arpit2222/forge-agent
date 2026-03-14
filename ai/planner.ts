import type { PromptType } from "../lib/types";

export function generatePlan(prompt: string, type: PromptType) {
  return {
    summary: `Plan for ${type}`,
    steps: [
      "Analyze prompt constraints",
      "Outline core pages and data models",
      "Generate Next.js + Prisma scaffold",
      "Assemble UI components and flows",
      "Validate build and package"
    ],
    prompt
  };
}
