'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperadminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/superadmin/overview');
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
    </div>
  );
}
