import "dotenv/config";
import { handleJob } from "../agent/processor";
import type { AgentJob } from "../lib/types";

const job: AgentJob = {
  id: `demo-${Date.now()}`,
  prompt: "Build a crypto analytics dashboard.",
  status: "queued",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

handleJob(job)
  .then(() => {
    console.log("Demo job complete", job.id);
  })
  .catch((err) => {
    console.error("Demo job failed", err);
    process.exit(1);
  });
