'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isAdminRoute = pathname.startsWith('/admin');
  const shouldShowRegularLayout = !isAdminRoute && user?.role !== 'ADMIN';

  if (isAdminRoute) {
    // Admin routes handle their own layout
    return <>{children}</>;
  }

  if (user?.role === 'ADMIN') {
    // Admin users shouldn't see regular layout (they'll be redirected)
    return <>{children}</>;
  }

  // Regular layout for non-admin users on non-admin routes
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#1a202c' }}>
      <Header />
      <main style={{ flex: 1, backgroundColor: '#1a202c' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}