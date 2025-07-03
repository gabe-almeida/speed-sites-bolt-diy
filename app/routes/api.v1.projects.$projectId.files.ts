import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { projectId } = params;

  if (!projectId) {
    return json({ error: 'Project ID is required' }, { status: 400 });
  }

  /*
   * In a real application, you would fetch the project files
   * from a database or file storage based on the projectId.
   */
  const files = {
    'src/index.js': "console.log('Hello, world!');",
    'package.json': `{ "name": "my-project", "version": "1.0.0" }`,
  };

  return json({ files });
};
