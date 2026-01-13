export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    const parts = hostname.split('.');

    if (parts.length > 2) {
      const subdomain = parts[0];

      if (subdomain !== 'www') {
        const newPath = `/stores/${subdomain}${url.pathname}`;
        const newUrl = new URL(newPath, `https://${parts.slice(1).join('.')}`);
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

        return new Response('Store not found', {
          status: 404,
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
          },
        });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
