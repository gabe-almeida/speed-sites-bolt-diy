import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

interface ProjectCreationRequest {
  prompt: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const { prompt } = (await request.json()) as ProjectCreationRequest;

  if (!prompt) {
    return json({ error: "Prompt is required" }, { status: 400 });
  }

  // In a real application, you would have a project generation service
  // that takes the prompt and creates a new project.
  const projectId = `prj_${Math.random().toString(36).substring(2, 15)}`;

  return json({ project_id: projectId }, { status: 201 });
};