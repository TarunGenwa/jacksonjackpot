'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCompetitionPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect back to competitions page
    router.push('/admin/competitions');
  }, [router]);

  return (
    <div className="flex h-96 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}