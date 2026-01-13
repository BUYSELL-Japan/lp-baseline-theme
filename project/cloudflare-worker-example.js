export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    const pathname = url.pathname;

    const parts = hostname.split('.');

    if (parts.length > 2) {
      const subdomain = parts[0];

      if (subdomain !== 'www') {
        let targetPath;

        if (pathname.startsWith('/_astro/')) {
          targetPath = pathname;
        } else {
          targetPath = `/stores/${subdomain}${pathname}`;
        }

        const newUrl = new URL(targetPath, `https://${parts.slice(1).join('.')}`);
        newUrl.search = url.search;
        newUrl.hash = url.hash;

        const assetRequest = new Request(newUrl, request);
        const response = await env.ASSETS.fetch(assetRequest);

        if (response.ok) {
          return new Response(response.body, {
            status: response.status,
            headers: response.headers,
          });
        }

        if (!pathname.startsWith('/_astro/')) {
          return new Response('Store not found', {
            status: 404,
            headers: {
              'Content-Type': 'text/html;charset=UTF-8',
            },
          });
        }
      }
    }

    return env.ASSETS.fetch(request);
  },
};
