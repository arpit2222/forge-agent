import { NextResponse } from "next/server";
import { isRunning } from "../../../lib/runtime";
import { readJobs, readPipelineState, readProjects, readStatus, readLogs } from "../../../lib/store";
import fs from "fs";
import path from "path";
import { PATHS } from "../../../lib/paths";

export async function GET() {
  const projects = readProjects().filter((project) => {
    if (project.outputDir && fs.existsSync(project.outputDir)) return true;
    const fallback = path.join(PATHS.generatedDir, project.id);
    return fs.existsSync(fallback);
  });

  const response = NextResponse.json({
    status: { ...readStatus(), running: isRunning() },
    pipeline: readPipelineState(),
    jobs: readJobs(),
    projects,
    logs: readLogs(40)
  });

  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("CDN-Cache-Control", "no-store");
  response.headers.set("Vercel-CDN-Cache-Control", "no-store");
  return response;
}
