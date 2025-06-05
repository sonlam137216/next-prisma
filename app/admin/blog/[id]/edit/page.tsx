'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const id = params.id;
    router.replace(`/admin/blog/${id}`);
  }, [params.id, router]);

  return null;
} 