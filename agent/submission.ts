import fs from "fs";
import { submitJob as submitJobRequest } from "../seedstr/client";

export async function submitJob(
  jobId: string,
  zipPath: string,
  metadata: Record<string, unknown>
) {
  const apiKey = process.env.SEEDSTR_API_KEY;
  const agentId = process.env.SEEDSTR_AGENT_ID;
  const shouldSkip = !apiKey || !agentId || jobId.startsWith("demo-") || jobId.startsWith("manual-");
  if (shouldSkip) {
    return { ok: true, status: 0, skipped: true };
  }

  const zipBase64 = fs.existsSync(zipPath)
    ? fs.readFileSync(zipPath).toString("base64")
    : null;

  return submitJobRequest(jobId, {
    ...metadata,
    artifact: zipBase64
  });
}
