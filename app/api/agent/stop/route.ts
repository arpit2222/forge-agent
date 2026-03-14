import { NextResponse } from "next/server";
import { stopAgent, isRunning } from "../../../../lib/runtime";

export async function POST() {
  stopAgent();
  return NextResponse.json({ ok: true, running: isRunning() });
}
