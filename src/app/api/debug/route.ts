import { NextResponse } from 'next/server';

export async function GET() {
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  const parsed = raw?.replace(/\\n/g, '\n') ?? 'MISSING';

  return NextResponse.json({
    startsWith: parsed.startsWith('-----BEGIN PRIVATE KEY-----'),
    endsWith: parsed.endsWith('-----END PRIVATE KEY-----\n'),
    lineCount: parsed.split('\n').length,
    firstLine: parsed.split('\n')[0],
  });
}
