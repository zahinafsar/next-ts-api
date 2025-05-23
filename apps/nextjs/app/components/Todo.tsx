'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { ApiRoutes } from '../../types/next-ts-api';

type Todo = ApiRoutes['todo']['GET']['response'][number];

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
    fetchSingle();
    fetchSingleWithType();
  }, []);

  const fetchTodos = async () => {
    const response = await api('todo', { method: 'GET' });
    const data = await response.json();
    setTodos(data);
  };

  const fetchSingle = async () => {
    const response = await api(`todo/[id]/create`, {
      method: 'GET',
      params: {
        id: 'xxr-x34r-x23-x-ef3',
      },
    });
    const data = await response.json();
    console.log(data);
  };

  const fetchSingleWithType = async () => {
    const response = await api(`todo/[id]/create/[type]`, {
      method: 'POST',
      params: {
        id: 'xxr-x34r-x23-x-ef3',
        type: 'content-type',
      },
      query: {
        content: 'hello-content',
        isCreate: true,
      },
      body: {
        text: 'hello-body',
      },
    });
    const data = await response.json();
    console.log(data);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const response = await api('todo', {
      method: 'POST',
      body: { text: newTodo },
    });
    const data = await response.json();
    setTodos([...todos, data]);
    setNewTodo('');
  };

  const toggleTodo = async (todo: Todo) => {
    const response = await api('todo', {
      method: 'PUT',
      body: { ...todo, completed: !todo.completed },
    });
    const updatedTodo = await response.json();
    setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
  };

  const deleteTodo = async (id: string) => {
    await api('todo', {
      method: 'DELETE',
      params: { id },
    });
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Todo App</h1>

      <form onSubmit={addTodo} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
                className="w-5 h-5 rounded border-gray-300 focus:ring-blue-500"
              />
              <span
                className={`${
                  todo.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
