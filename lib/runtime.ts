import { startPolling } from "../agent/poller";
import { handleJob } from "../agent/processor";
import { registerAgent } from "../seedstr/client";
import { info } from "./logger";

let running = false;
let stopFn: null | (() => void) = null;

export function isRunning() {
  return running;
}

export function startAgent() {
  if (running) return;
  running = true;
  info("agent loop started");
  registerAgent();
  stopFn = startPolling(async (job) => {
    await handleJob(job);
  });
}

export function stopAgent() {
  if (!running) return;
  running = false;
  stopFn?.();
  stopFn = null;
  info("agent loop stopped");
}
