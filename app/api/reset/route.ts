import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PATHS } from "../../../lib/paths";

const LOG_PATH = path.join(PATHS.logsDir, "agent.log");
const JOBS_PATH = path.join(PATHS.pipelineDir, "jobs.json");
const STATE_PATH = path.join(PATHS.pipelineDir, "state.json");
const PROJECTS_PATH = path.join(PATHS.projectsDir, "index.json");

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
    fs.mkdirSync(PATHS.logsDir, { recursive: true });
    fs.mkdirSync(PATHS.pipelineDir, { recursive: true });
    fs.mkdirSync(PATHS.projectsDir, { recursive: true });
    fs.mkdirSync(PATHS.generatedDir, { recursive: true });

    fs.writeFileSync(LOG_PATH, "", "utf-8");
    fs.writeFileSync(JOBS_PATH, "[]", "utf-8");
    fs.writeFileSync(PROJECTS_PATH, "[]", "utf-8");
    fs.writeFileSync(STATE_PATH, JSON.stringify(initialState, null, 2), "utf-8");

    for (const entry of fs.readdirSync(PATHS.generatedDir)) {
      fs.rmSync(path.join(PATHS.generatedDir, entry), { recursive: true, force: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
