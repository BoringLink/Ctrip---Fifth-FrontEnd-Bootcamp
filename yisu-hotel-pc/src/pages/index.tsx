import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, getUser } from '../lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    } else {
      const user = getUser();
      if (user?.role === 'merchant') {
        router.replace('/merchant/hotels');
      } else {
        router.replace('/admin/audits');
      }
    }
  }, [router]);

  return null;
}