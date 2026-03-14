import fs from "fs";
import path from "path";

export async function writeProject(project: {
  name: string;
  description: string;
  files: { path: string; content: string }[];
}) {
  const projectId = `project-${Date.now()}`;
  const outputDir = path.join(process.cwd(), "generated", projectId);
  fs.mkdirSync(outputDir, { recursive: true });

  for (const file of project.files) {
    const filePath = path.join(outputDir, file.path);
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, file.content, "utf-8");
  }

  const fileTree = project.files.map((file) => file.path);
  const preview = project.files.find((file) => file.path.endsWith("app/page.tsx"))
    ?.content.slice(0, 400) ??
    project.description;

  return { projectId, outputDir, fileTree, preview };
}
