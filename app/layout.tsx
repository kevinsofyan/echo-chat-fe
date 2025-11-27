'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "@/components/auth-guard";
import { useEffect } from "react";
import { useUserStore } from "@/store/user.store";
import { useAuthStore } from "@/store/auth.store";
import { usersApi } from "@/api/users";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { setUser } = useUserStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated) return;

      try {
        const user = await usersApi.getMe();
        setUser(user.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, [isAuthenticated, setUser]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthGuard>
          <RootLayoutContent>{children}</RootLayoutContent>
        </AuthGuard>
      </body>
    </html>
  );
}
