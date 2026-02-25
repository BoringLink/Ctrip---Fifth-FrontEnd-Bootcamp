import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, hasRole } from '../lib/auth';

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function RequireAuth({ children, allowedRoles }: Props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.replace('/login');
        return false;
      }
      if (allowedRoles && !allowedRoles.some(role => hasRole(role))) {
        router.replace('/unauthorized');
        return false;
      }
      return true;
    };

    const result = checkAuth();
    setAuthorized(result);
  }, [router, allowedRoles]);

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}