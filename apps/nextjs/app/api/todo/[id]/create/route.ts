import { NextResponse } from 'next/server';
import { NextApiRequest } from 'next-ts-api';

export async function POST(request: Request) {
  const body = await request.json();
  const newTodo = {
    id: Date.now().toString(),
    text: body.text,
    completed: false,
  };
  return NextResponse.json(newTodo);
}

export async function GET(
  request: NextApiRequest<null, { content: string }>,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = await request.nextUrl.searchParams;
  const content = searchParams.get('content');

  return NextResponse.json({ idFromCreateGet: id, content });
}