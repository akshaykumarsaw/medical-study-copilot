'use client';

import React, { useEffect, useState } from 'react';
import { Search, Bell, Menu, User } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export const TopBar = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  return (
    <div className="h-16 px-4 md:px-8 border-b border-medical-brown/10 flex items-center justify-between bg-parchment-light">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-medical-brown/60 hover:text-medical-teal hover:bg-black/5 rounded-md">
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-md text-sm text-medical-muted w-64 border border-transparent focus-within:border-medical-teal/30 focus-within:bg-white transition-all">
          <Search className="w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search (Ctrl+K)" 
            className="bg-transparent border-none outline-none w-full text-medical-brown"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-medical-muted hover:text-medical-teal transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-medical-brown leading-tight">
              {user?.name || 'Loading...'}
            </p>
            <p className="text-xs text-medical-muted">
              {user?.programme} (Year {user?.year})
            </p>
          </div>
          <div className="w-9 h-9 bg-medical-teal text-white rounded-full flex items-center justify-center font-bold shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <button 
            onClick={() => { authService.logout(); router.push('/login'); }}
            className="text-xs text-red-500 font-medium hover:underline ml-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
