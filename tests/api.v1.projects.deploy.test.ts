import { describe, it, expect, vi } from 'vitest';
import { NetlifyService } from '~/services/netlify.server';
import { ProjectService } from '~/services/project.server';

vi.mock('~/services/netlify.server');
vi.mock('~/services/project.server');

interface CreateProjectResponse {
  project_id: string;
}

interface DeployResponse {
  deployment_url: string;
}

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