import fs from "fs";
import path from "path";
import archiver from "archiver";

export async function zipProject(outputDir: string, projectId: string) {
  const zipPath = path.join(process.cwd(), "generated", `${projectId}.zip`);

  await new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve());
    archive.on("error", (err) => reject(err));

    archive.pipe(output);
    archive.directory(outputDir, false);
    archive.finalize();
  });

  return zipPath;
}
