import path from "path";

const root = process.cwd();
const tmpBase = process.env.TMPDIR || "/tmp";
const useTmp =
  !!process.env.VERCEL ||
  !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
  !!process.env.NETLIFY ||
  process.env.NODE_ENV === "production";

const stateRoot = process.env.STATE_DIR || (useTmp ? path.join(tmpBase, "forge-agent") : root);

export const PATHS = {
  root,
  stateRoot,
  logsDir: path.join(stateRoot, "logs"),
  pipelineDir: path.join(stateRoot, "pipeline"),
  projectsDir: path.join(stateRoot, "projects"),
  generatedDir: path.join(stateRoot, "generated")
};
