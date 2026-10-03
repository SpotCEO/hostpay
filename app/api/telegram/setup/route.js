import { setupHandler } from '../../../../lib/telegram/setup.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;
export async function POST(request) { return setupHandler({ env: process.env })(request); }

