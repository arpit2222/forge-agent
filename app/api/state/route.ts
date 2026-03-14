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

  return NextResponse.json({
    status: { ...readStatus(), running: isRunning() },
    pipeline: readPipelineState(),
    jobs: readJobs(),
    projects,
    logs: readLogs(40)
  });
}
