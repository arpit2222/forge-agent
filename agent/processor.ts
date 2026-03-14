import { interpretPrompt } from "../ai/interpreter";
import { generatePlan } from "../ai/planner";
import { generateProject } from "../ai/generator";
import { buildProject } from "../builder/template";
import { writeProject } from "../builder/writer";
import { zipProject } from "../builder/zipper";
import { submitJob } from "./submission";
import { needsClarification, clarificationQuestions } from "../clarification/questions";
import { addProject, updateJob, updatePipelineStage, logEvent } from "../lib/store";
import type { AgentJob } from "../lib/types";

export async function handleJob(job: AgentJob) {
  updateJob(job.id, "running");
  updatePipelineStage("Job Received", "done");

  if (!job.prompt.trim()) {
    updateJob(job.id, "failed");
    updatePipelineStage("Prompt Analysis", "error");
    logEvent("invalid prompt", { jobId: job.id });
    return;
  }

  try {
    updatePipelineStage("Prompt Analysis", "active");
    const interpretation = interpretPrompt(job.prompt);
    updatePipelineStage("Prompt Analysis", "done");

    let clarification = null as null | string[];
    updatePipelineStage("Clarification", "active");
    if (needsClarification(job.prompt)) {
      clarification = clarificationQuestions(job.prompt);
      updateJob(job.id, "clarification");
      logEvent("clarification required", { jobId: job.id, questions: clarification });
    }
    updatePipelineStage("Clarification", "done");

    updatePipelineStage("Code Generation", "active");
    const plan = generatePlan(job.prompt, interpretation.type);
    const aiProject = await generateProject(job.prompt, plan);
    updatePipelineStage("Code Generation", "done");

    updatePipelineStage("Project Assembly", "active");
    const templateProject = buildProject({
      name: aiProject.name,
      description: aiProject.description,
      promptType: interpretation.type
    });
    const finalProject = {
      ...templateProject,
      files: aiProject.files.length ? aiProject.files : templateProject.files
    };
    const written = await writeProject(finalProject);
    updatePipelineStage("Project Assembly", "done");

    updatePipelineStage("Zip Packaging", "active");
    const zipPath = await zipProject(written.outputDir, written.projectId);
    updatePipelineStage("Zip Packaging", "done");

    updatePipelineStage("Submission", "active");
    const submission = await submitJob(job.id, zipPath, {
      prompt: job.prompt,
      clarification,
      plan
    });
    updatePipelineStage("Submission", "done");

    addProject({
      id: written.projectId,
      title: finalProject.name,
      description: finalProject.description,
      createdAt: new Date().toISOString(),
      promptType: interpretation.type,
      fileTree: written.fileTree,
      preview: written.preview,
      zipPath,
      outputDir: written.outputDir
    });

    updateJob(job.id, submission.ok ? "completed" : "failed");
    logEvent("job completed", { jobId: job.id, submission });
  } catch (err) {
    updateJob(job.id, "failed");
    updatePipelineStage("Submission", "error");
    logEvent("job failed", { jobId: job.id, error: String(err) });
  }
}
