import { NextApiRequest } from 'next-ts-api';
import { NextResponse } from 'next/server';

// Simple in-memory storage for todos
let todos: { id: string; text: string; completed: boolean }[] = [];

export async function PUT(request: NextApiRequest<{ id: string }>) {
  const body = await request.json();
  const todoIndex = todos.findIndex((todo) => todo.id === body.id);
  if (todoIndex === -1) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }
  todos[todoIndex] = { ...todos[todoIndex], ...body };
  return NextResponse.json(todos[todoIndex]);
}

export async function DELETE(request: NextApiRequest<null, { id: string }>) {
  const searchParams = await request.nextUrl.searchParams
  const id = searchParams.get('id');
  todos = todos.filter((todo) => todo.id !== id);
  return NextResponse.json({ success: true });
}