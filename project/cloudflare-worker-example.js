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
          // 共有アセットはそのまま
          targetPath = pathname;

        } else if (subdomain === 'demo') {
          // demo.global-reaches.com/theme1 → /demo/theme1/
          // demo.global-reaches.com/theme2 → /demo/theme2/
          // demo.global-reaches.com/theme3 → /demo/theme3/
          // demo.global-reaches.com/       → /demo/theme1/ (デフォルト)
          const demoPath = pathname === '/' ? '/theme1' : pathname;
          targetPath = `/demo${demoPath}`;

        } else {
          // 通常の店舗サブドメイン
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
          return new Response('Page not found', {
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
