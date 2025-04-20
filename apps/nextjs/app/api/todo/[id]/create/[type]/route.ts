import { NextResponse } from 'next/server';
import { NextApiRequest } from 'next-ts-api';

export async function POST(
  request: NextApiRequest<{
    text: string;
  }, {
    content: string;
  }>,
  { params }: { params: Promise<{ id: string, type: string }> }
) {
  const { id, type } = await params;
  const searchParams = await request.nextUrl.searchParams;
  const content = searchParams.get('content');

  return NextResponse.json({ idFromCreateGet: id, typeFromCreateGet: type, content });
}

export async function GET(
  request: NextApiRequest<null, { content: string }>,
  { params }: { params: Promise<{ id: string; type: string }> }
) {
  const { id, type } = await params;
  const searchParams = await request.nextUrl.searchParams;
  const content = searchParams.get('content');

  return NextResponse.json({ idFromCreateGet: id, typeFromCreateGet: type, content });
}