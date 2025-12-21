export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    const subdomain = hostname.split('.')[0];

    if (subdomain && subdomain !== 'www' && subdomain !== hostname) {
      const storeId = subdomain;

      const indexUrl = `https://yourdomain.com/index.html`;

      const response = await fetch(indexUrl);

      if (response.ok) {
        const html = await response.text();

        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    }

    return fetch(request);
  },
};
