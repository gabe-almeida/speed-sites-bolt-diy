import { describe, it, expect, vi } from 'vitest';
import { ProjectService } from '~/services/project.server';
import { NetlifyService } from '~/services/netlify.server';

vi.mock('~/services/project.server');
vi.mock('~/services/netlify.server');

interface CreateProjectResponse {
  project_id: string;
}

interface ProjectFilesResponse {
  files: Record<string, string>;
}

interface DeployResponse {
  deployment_url: string;
}

describe('/api/v1/projects', () => {
  it('should create a new project and return 201', async () => {
    const { action } = await import('~/routes/api.v1.projects');
    const request = new Request('http://localhost/api/v1/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Create a new React application with a single button.',
      }),
    });
    const response = await action({ request, context: {} as any, params: {} });
    expect(response.status).toBe(201);
    const { project_id } = (await response.json()) as CreateProjectResponse;
    expect(project_id).toBeDefined();
  });
});

describe('/api/v1/projects/{projectId}/files', () => {
  it('should return the project file structure', async () => {
    const projectId = 'test-project-id';
    const mockFiles = { 'index.js': 'console.log("hello")' };
    vi.mocked(ProjectService.getProjectFiles).mockResolvedValue(mockFiles);

    const { loader } = await import('~/routes/api.v1.projects.$projectId.files');
    const request = new Request(`http://localhost/api/v1/projects/${projectId}/files`);
    const response = await loader({ request, context: {} as any, params: { projectId } });

    expect(response.status).toBe(200);
    const { files } = (await response.json()) as ProjectFilesResponse;
    expect(files).toEqual(mockFiles);
  });
});

describe('/api/v1/projects/{projectId}/deploy', () => {
  it('should deploy the project and return 200 with the deployment URL', async () => {
    const project_id = 'test-project-id';
    const mockDeploymentUrl = 'https://mock-deployment-url.com';

    vi.mocked(ProjectService.getProjectFiles).mockResolvedValue({
      'index.js': 'console.log("hello world")',
    });

    vi.mocked(NetlifyService.deploy).mockResolvedValue({
      deploy: { url: mockDeploymentUrl, id: '1', state: 'ready' },
      site: { id: '1', name: 'mock-site', url: 'https://mock-site.com', chatId: '1' },
    });

    const { action } = await import('~/routes/api.v1.projects.$projectId.deploy');

    const request = new Request(`http://localhost:5175/api/v1/projects/${project_id}/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ netlify_token: 'test-token' }),
    });

    const response = await action({
      request,
      params: { projectId: project_id },
      context: {
        cloudflare: {
          env: {},
        },
      } as any,
    });

    expect(response.status).toBe(200);
    const { deployment_url } = (await response.json()) as DeployResponse;
    expect(deployment_url).toBe(mockDeploymentUrl);
  });
});