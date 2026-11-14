addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;

  const ORIGIN_DOMAIN = 'lp-baseline-theme.pages.dev';

  const specialDomains = [
    'admin-lp.global-reaches.com',
    'register.global-reaches.com',
    'demo.global-reaches.com',
    'global-reaches.com',
    'www.global-reaches.com'
  ];

  if (hostname === 'admin-lp.global-reaches.com') {
    return fetch(request);
  }

  if (hostname === 'register.global-reaches.com') {
    return fetch(request);
  }

  if (hostname === 'global-reaches.com' || hostname === 'www.global-reaches.com') {
    return new Response('Not Found', { status: 404 });
  }

  const isWildcardRequest = hostname.endsWith('.global-reaches.com') && !specialDomains.includes(hostname);
  const isStaticAsset = pathname.includes('.') && !pathname.endsWith('.html');

  if (hostname === 'demo.global-reaches.com') {
    let demoPath = pathname;

    if (demoPath === '/' || demoPath === '') {
      demoPath = '/theme1/';
    }

    let targetPath;
    if (demoPath.startsWith('/_astro/')) {
      targetPath = demoPath;
    } else {
      let normalizedPath = demoPath;
      if (!normalizedPath.includes('.')) {
        normalizedPath = normalizedPath.endsWith('/')
          ? `${normalizedPath}index.html`
          : `${normalizedPath}/index.html`;
      }
      targetPath = `/demo${normalizedPath}`;
    }

    const assetUrl = `https://${ORIGIN_DOMAIN}${targetPath}`;
    let response = await fetch(new Request(assetUrl, {
      headers: request.headers,
      method: request.method
    }));

    if (response.ok) {
      return response;
    }

    if (response.status === 404 && !pathname.includes('.')) {
      const fallbackUrl = `https://${ORIGIN_DOMAIN}/demo/theme1/index.html`;
      return fetch(fallbackUrl);
    }

    return response;
  }

  if (isWildcardRequest) {
    const subdomain = hostname.split('.')[0];

    // 店舗ごとのSEO/AIファイルをサブドメインの /stores/<slug>/ に振り分け
    const STORE_ROOT_FILES = new Set(['/robots.txt', '/sitemap.xml', '/llms.txt']);
    if (STORE_ROOT_FILES.has(pathname)) {
      const targetUrl = `https://${ORIGIN_DOMAIN}/stores/${subdomain}${pathname}`;
      const response = await fetch(new Request(targetUrl, {
        headers: request.headers,
        method: request.method
      }));
      // ファイルがない店舗には404を返す（HTMLのPage Not Foundを返さない）
      if (!response.ok || (response.headers.get('content-type') || '').includes('text/html')) {
        return new Response('Not found', { status: 404 });
      }
      return response;
    }

    if (isStaticAsset) {
      const assetUrl = `https://${ORIGIN_DOMAIN}${pathname}`;
      return fetch(new Request(assetUrl, {
        headers: request.headers,
        method: request.method
      }));
    } else {
      let targetPath = pathname;
      if (pathname === '/' || pathname === '') {
        targetPath = '/index.html';
      } else if (!pathname.includes('.')) {
        targetPath = pathname.endsWith('/')
          ? `${pathname}index.html`
          : `${pathname}/index.html`;
      }

      const newUrl = `https://${ORIGIN_DOMAIN}/stores/${subdomain}${targetPath}`;

      const newHeaders = new Headers(request.headers);
      newHeaders.set('X-Forwarded-Host', hostname);

      let response = await fetch(new Request(newUrl, {
        method: request.method,
        headers: newHeaders,
        redirect: 'follow'
      }));

      // 存在しないページは Pages の 404.html（ステータス404）をそのまま返す。
      // 以前はここで店舗トップにフォールバックしていたが、Pages が 404 を返すようになったため
      // 「どんなURLでも店舗トップが200で返る」状態になってしまう。そのため削除した。

      return response;
    }
  }

  return fetch(request);
}