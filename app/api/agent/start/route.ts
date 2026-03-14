import { NextResponse } from "next/server";
import { startAgent, isRunning } from "../../../../lib/runtime";

export async function POST() {
  startAgent();
  return NextResponse.json({ ok: true, running: isRunning() });
}
