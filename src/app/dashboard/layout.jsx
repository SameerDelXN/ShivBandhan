// src/app/dashboard/layout.jsx
'use client'; 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserLayout from '@/layouts/UserLayout';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/session', {
          credentials: 'include' // Important for cookies
        });

        if (!response.ok) throw new Error('Session check failed');

        const data = await response.json();
        
        if (!data.user) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Session verification error:', error);
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  return <UserLayout>{children}</UserLayout>;
}