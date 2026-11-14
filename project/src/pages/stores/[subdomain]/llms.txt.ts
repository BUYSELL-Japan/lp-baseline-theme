import type { APIRoute } from 'astro';
import { buildLlmsTxt } from '../../../utils/seo';
import { aiSeoStaticPaths } from '../../../utils/seoPaths';

export const getStaticPaths = aiSeoStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(buildLlmsTxt(props.pageData, props.subdomain), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
