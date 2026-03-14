import { logEvent } from "./store";

export function info(message: string, meta?: Record<string, unknown>) {
  logEvent(message, { level: "info", ...meta });
}

export function warn(message: string, meta?: Record<string, unknown>) {
  logEvent(message, { level: "warn", ...meta });
}

export function error(message: string, meta?: Record<string, unknown>) {
  logEvent(message, { level: "error", ...meta });
}
