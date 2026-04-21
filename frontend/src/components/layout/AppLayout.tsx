'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useRouter } from 'next/navigation';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('arivu_token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
    setIsLoading(false);
  }, [router]);

  // If we are definitely not authorized (redirecting), show a subtle full screen loader
  if (isLoading && !isAuthorized) {
    return (
      <div className="h-screen w-screen bg-parchment flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-medical-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-parchment-light overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {isAuthorized ? children : (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-medical-teal border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
