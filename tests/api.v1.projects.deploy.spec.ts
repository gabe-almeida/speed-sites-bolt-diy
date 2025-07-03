import { describe, it, expect, vi } from 'vitest';

// Mock services
vi.mock('../app/services/project.server', () => ({
  ProjectService: {
    getProjectFiles: vi.fn(),
  },
}));

vi.mock('../app/services/netlify.server', () => ({
  NetlifyService: {
    deploy: vi.fn(),
  },
}));

// Import the action function after the mocks have been set up
import { action } from '../app/routes/api.v1.projects.$projectId.deploy';
import { ProjectService } from '../app/services/project.server';
import { NetlifyService } from '../app/services/netlify.server';

interface DeployResponse {
  deployment_url: string;
}

describe('/api/v1/projects/{projectId}/deploy', () => {
  it('should deploy the project and return 200 with the deployment URL', async () => {
    const project_id = 'test-project-id';
    const mockDeploymentUrl = 'https://mock-deployment-url.com';

    // Arrange
    vi.mocked(ProjectService.getProjectFiles).mockResolvedValue({
      'index.js': 'console.log("hello world")',
    });

    vi.mocked(NetlifyService.deploy).mockResolvedValue({
      deploy: { url: mockDeploymentUrl, id: '1', state: 'ready' },
      site: { id: '1', name: 'mock-site', url: 'https://mock-site.com', chatId: '1' },
    });

    const request = new Request(`http://localhost:5175/api/v1/projects/${project_id}/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ netlify_token: 'test-token' }),
    });

    // Act
    const response = await action({
      request,
      params: { projectId: project_id },
      context: {} as any, // Cast to any to avoid type errors with the context
    });

    // Assert
    expect(response.status).toBe(200);
    const { deployment_url } = (await response.json()) as DeployResponse;
    expect(deployment_url).toBe(mockDeploymentUrl);
  });
});