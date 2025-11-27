'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type AuthGuardProps = {
  children: React.ReactNode;
};

const PUBLIC_ROUTES = ['/login', '/register'];

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const authData = localStorage.getItem('auth-storage');
    const isAuthenticated = authData ? JSON.parse(authData).state.isAuthenticated : false;

    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
    } else if (isAuthenticated && isPublicRoute) {
      router.push('/');
    }
  }, [pathname]);

  return <>{children}</>;
}