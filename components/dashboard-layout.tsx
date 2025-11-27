'use client';

import { ReactNode } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, MessageCircle } from 'lucide-react';

interface IDashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: IDashboardLayoutProps) {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-80 border-r border-border bg-surface flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-primary truncate">{user?.name}</h3>
              <p className="text-xs text-text-secondary truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleLogout}
              className="shrink-0"
            >
              <LogOut />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <MessageCircle />
              New Chat
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Settings />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Online</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

