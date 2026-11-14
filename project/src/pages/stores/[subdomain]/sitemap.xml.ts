import type { APIRoute } from 'astro';
import { buildSitemapXml } from '../../../utils/seo';
import { aiSeoStaticPaths } from '../../../utils/seoPaths';

export const getStaticPaths = aiSeoStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(buildSitemapXml(props.subdomain, props.updatedAt), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
