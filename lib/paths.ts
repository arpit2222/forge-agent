import path from "path";

const root = process.cwd();
const stateRoot = process.env.STATE_DIR || (process.env.VERCEL ? "/tmp/forge-agent" : root);

export const PATHS = {
  root,
  stateRoot,
  logsDir: path.join(stateRoot, "logs"),
  pipelineDir: path.join(stateRoot, "pipeline"),
  projectsDir: path.join(stateRoot, "projects"),
  generatedDir: path.join(stateRoot, "generated")
};
