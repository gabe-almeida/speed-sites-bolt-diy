import type { ServerBuild } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';

export const onRequest: PagesFunction = async (context) => {
  // @ts-ignore - this is a dynamic import
  const serverBuild = (await import('../build/server/index.js')) as unknown as ServerBuild;

  const handler = createPagesFunctionHandler({
    build: serverBuild,
  });

  return handler(context);
};
