import { type ActionFunctionArgs, json } from '@remix-run/cloudflare';
import { NetlifyService } from '~/services/netlify.server';

interface DeployRequestBody {
  siteId?: string;
  files: Record<string, string>;
  chatId: string;
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const { siteId, files, token, chatId } = (await request.json()) as DeployRequestBody & { token: string };
    const result = await NetlifyService.deploy({ siteId, files, token, chatId });

    return json({ success: true, ...result });
  } catch (error) {
    console.error('Deploy error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Deployment failed';

    return json({ error: errorMessage }, { status: 500 });
  }
}
