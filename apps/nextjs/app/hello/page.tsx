'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Hello() {
  const [message, setMessage] = useState<string>('Loading...');

  useEffect(() => {
    const fetchHello = async () => {
      try {
        const res = await api('todo', {
          method: 'GET',
        });
        const data = await res.json();
        setMessage(data[0].text);
      } catch (error) {
        console.error('Failed to fetch hello:', error);
        setMessage('Error loading message');
      }
    };

    void fetchHello();
  }, []);

  return <div>{message}</div>;
}
