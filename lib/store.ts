import fs from "fs";
import path from "path";
import type { AgentJob, AgentStatus, GeneratedProject, PipelineState } from "./types";
import { PATHS } from "./paths";

const LOG_PATH = path.join(PATHS.logsDir, "agent.log");
const STATE_PATH = path.join(PATHS.pipelineDir, "state.json");
const JOBS_PATH = path.join(PATHS.pipelineDir, "jobs.json");
const PROJECTS_PATH = path.join(PATHS.projectsDir, "index.json");

export function ensureStore() {
  if (!fs.existsSync(PATHS.logsDir)) fs.mkdirSync(PATHS.logsDir, { recursive: true });
  if (!fs.existsSync(PATHS.pipelineDir)) fs.mkdirSync(PATHS.pipelineDir, { recursive: true });
  if (!fs.existsSync(PATHS.projectsDir)) fs.mkdirSync(PATHS.projectsDir, { recursive: true });
  if (!fs.existsSync(PATHS.generatedDir)) fs.mkdirSync(PATHS.generatedDir, { recursive: true });

  if (!fs.existsSync(LOG_PATH)) fs.writeFileSync(LOG_PATH, "", "utf-8");
  if (!fs.existsSync(STATE_PATH)) {
    const initial: PipelineState = {
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
    fs.writeFileSync(STATE_PATH, JSON.stringify(initial, null, 2), "utf-8");
  }
  if (!fs.existsSync(JOBS_PATH)) {
    fs.writeFileSync(JOBS_PATH, JSON.stringify([], null, 2), "utf-8");
  }
  if (!fs.existsSync(PROJECTS_PATH)) {
    fs.writeFileSync(PROJECTS_PATH, JSON.stringify([], null, 2), "utf-8");
  }
}

function readJson<T>(filePath: string, fallback: T): T {
  ensureStore();
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return raw.trim().length ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(filePath: string, payload: T) {
  ensureStore();
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
}

export function appendLogLine(line: string) {
  ensureStore();
  fs.appendFileSync(LOG_PATH, line + "\n", "utf-8");
}

export function readLogs(limit = 50): string[] {
  ensureStore();
  const raw = fs.readFileSync(LOG_PATH, "utf-8");
  const lines = raw.trim().length ? raw.trim().split("\n") : [];
  return lines.slice(-limit).reverse();
}

export function readPipelineState(): PipelineState {
  return readJson<PipelineState>(STATE_PATH, { stages: [] });
}

export function updatePipelineStage(
  name: string,
  status: PipelineState["stages"][number]["status"]
) {
  const state = readPipelineState();
  const updated = state.stages.map((stage) =>
    stage.name === name
      ? { ...stage, status, updatedAt: new Date().toISOString() }
      : stage
  );
  writeJson(STATE_PATH, { stages: updated });
}

export function readJobs(): AgentJob[] {
  return readJson<AgentJob[]>(JOBS_PATH, []);
}

export function addJob(job: AgentJob) {
  const jobs = readJobs();
  jobs.unshift(job);
  writeJson(JOBS_PATH, jobs.slice(0, 50));
}

export function updateJob(id: string, status: AgentJob["status"]) {
  const jobs = readJobs();
  const updated = jobs.map((job) =>
    job.id === id
      ? { ...job, status, updatedAt: new Date().toISOString() }
      : job
  );
  writeJson(JOBS_PATH, updated);
}

export function readProjects(): GeneratedProject[] {
  return readJson<GeneratedProject[]>(PROJECTS_PATH, []);
}

export function addProject(project: GeneratedProject) {
  const projects = readProjects();
  projects.unshift(project);
  writeJson(PROJECTS_PATH, projects.slice(0, 20));
}

export function readStatus(): AgentStatus {
  const jobs = readJobs();
  const completed = jobs.filter((job) => job.status === "completed").length;
  const total = jobs.length;
  const successRate = total ? Math.round((completed / total) * 100) : 0;
  const recentActivity = readLogs(6).map((line) => {
    const parsed = safeParse(line);
    return parsed?.message ?? line;
  });
  return {
    running: false,
    lastRun: jobs[0]?.updatedAt ?? jobs[0]?.createdAt,
    jobsReceived: total,
    jobsCompleted: completed,
    successRate,
    recentActivity
  };
}

function safeParse(line: string) {
  try {
    return JSON.parse(line) as { message?: string };
  } catch {
    return null;
  }
}

export function logEvent(message: string, meta?: Record<string, unknown>) {
  appendLogLine(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      message,
      ...meta
    })
  );
}
