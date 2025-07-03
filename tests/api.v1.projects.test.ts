import { describe, it, expect } from 'vitest';

interface CreateProjectResponse {
  project_id: string;
}

interface ProjectFilesResponse {
  files: Record<string, string>;
}

describe('/api/v1/projects', () => {
  it('should create a new project and return 201', async () => {
    const response = await fetch('http://localhost:5175/api/v1/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Create a new React application with a single button.',
      }),
    });

    expect(response.status).toBe(201);
    const { project_id } = (await response.json()) as CreateProjectResponse;
    expect(project_id).toBeDefined();
  });
});

describe('/api/v1/projects/{projectId}/files', () => {
  it('should return the project file structure', async () => {
    // First, create a project to get a valid project_id
    const createResponse = await fetch('http://localhost:5175/api/v1/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Create a new React application with a single button.',
      }),
    });
    const { project_id } = (await createResponse.json()) as CreateProjectResponse;

    const response = await fetch(`http://localhost:5175/api/v1/projects/${project_id}/files`);
    expect(response.status).toBe(200);
    const { files } = (await response.json()) as ProjectFilesResponse;
    expect(files).toBeDefined();
  });
});