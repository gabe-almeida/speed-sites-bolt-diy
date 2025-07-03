import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { ProjectService } from '~/services/project.server';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { projectId } = params;

  if (!projectId) {
    return json({ error: 'Project ID is required' }, { status: 400 });
  }

  try {
    const files = await ProjectService.getProjectFiles(projectId);
    return json({ files });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve project files';
    return json({ error: errorMessage }, { status: 500 });
  }
};
