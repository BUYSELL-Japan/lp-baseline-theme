import type { APIRoute } from 'astro';
import { buildRobotsTxt } from '../../../utils/seo';
import { aiSeoStaticPaths } from '../../../utils/seoPaths';

export const getStaticPaths = aiSeoStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(buildRobotsTxt(props.subdomain), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
