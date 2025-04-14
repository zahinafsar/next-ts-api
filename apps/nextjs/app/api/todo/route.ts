import { NextResponse } from 'next/server';

// Simple in-memory storage for todos
let todos: { id: string; text: string; completed: boolean }[] = [];

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newTodo = {
    id: Date.now().toString(),
    text: body.text,
    completed: false,
  };
  todos.push(newTodo);
  return NextResponse.json(newTodo);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const todoIndex = todos.findIndex((todo) => todo.id === body.id);
  if (todoIndex === -1) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }
  todos[todoIndex] = { ...todos[todoIndex], ...body };
  return NextResponse.json(todos[todoIndex]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  todos = todos.filter((todo) => todo.id !== id);
  return NextResponse.json({ success: true });
} 