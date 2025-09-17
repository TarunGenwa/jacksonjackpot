'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useRouteProtection() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // If user is admin and not already on admin routes, redirect to admin
    if (user?.role === 'ADMIN' && !pathname.startsWith('/admin')) {
      router.push('/admin');
      return;
    }

    // If user is not admin and trying to access admin routes, redirect to home
    if (user?.role !== 'ADMIN' && pathname.startsWith('/admin')) {
      router.push('/');
      return;
    }
  }, [user, isLoading, pathname, router]);

  return {
    isAdminUser: user?.role === 'ADMIN',
    isOnAdminRoute: pathname.startsWith('/admin'),
    shouldShowAdminOnly: user?.role === 'ADMIN',
  };
}