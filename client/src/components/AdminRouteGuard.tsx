'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // If user is admin and not on admin routes, redirect to admin
    if (user?.role === 'ADMIN' && !pathname.startsWith('/admin')) {
      router.push('/admin');
      return;
    }
  }, [user, isLoading, pathname, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If admin user is on non-admin route, show nothing (redirect will happen)
  if (user?.role === 'ADMIN' && !pathname.startsWith('/admin')) {
    return null;
  }

  // If non-admin user is on admin route, show nothing (redirect will happen)
  if (user?.role !== 'ADMIN' && pathname.startsWith('/admin')) {
    return null;
  }

  return <>{children}</>;
}