import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOG_PATH = path.join(process.cwd(), "logs", "agent.log");
const JOBS_PATH = path.join(process.cwd(), "pipeline", "jobs.json");
const STATE_PATH = path.join(process.cwd(), "pipeline", "state.json");
const PROJECTS_PATH = path.join(process.cwd(), "projects", "index.json");
const GENERATED_DIR = path.join(process.cwd(), "generated");

const initialState = {
  stages: [
    { name: "Job Received", status: "idle" },
    { name: "Prompt Analysis", status: "idle" },
    { name: "Clarification", status: "idle" },
    { name: "Code Generation", status: "idle" },
    { name: "Project Assembly", status: "idle" },
    { name: "Zip Packaging", status: "idle" },
    { name: "Submission", status: "idle" }
  ]
};

export async function POST() {
  try {
    fs.writeFileSync(LOG_PATH, "", "utf-8");
    fs.writeFileSync(JOBS_PATH, "[]", "utf-8");
    fs.writeFileSync(PROJECTS_PATH, "[]", "utf-8");
    fs.writeFileSync(STATE_PATH, JSON.stringify(initialState, null, 2), "utf-8");

    if (fs.existsSync(GENERATED_DIR)) {
      for (const entry of fs.readdirSync(GENERATED_DIR)) {
        fs.rmSync(path.join(GENERATED_DIR, entry), { recursive: true, force: true });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
