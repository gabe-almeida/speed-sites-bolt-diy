import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NetlifyService } from '~/services/netlify.server';
import { ProjectService } from '~/services/project.server';

interface DeployRequest {
  netlify_token: string;
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { projectId } = params;

  if (!projectId) {
    return json({ error: 'Project ID is required' }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { netlify_token } = (await request.json()) as DeployRequest;

  if (!netlify_token) {
    return json({ error: 'Netlify token is required' }, { status: 400 });
  }

  try {
    const files = await ProjectService.getProjectFiles(projectId);
    const result = await NetlifyService.deploy({
      files,
      token: netlify_token,
      chatId: projectId, // Using projectId as a stand-in for chatId
    });

    return json({ deployment_url: result.deploy.url });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Deployment failed';
    return json({ error: errorMessage }, { status: 500 });
  }
};
