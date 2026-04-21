'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  CheckCircle, 
  Network, 
  Settings, 
  BookOpen, 
  CalendarDays,
  Activity
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Tutor', href: '/tutor', icon: MessageSquare },
  { name: 'Quizzes', href: '/quizzes', icon: CheckCircle },
  { name: 'Mind Maps', href: '/mindmaps', icon: Network },
  { name: 'Anatomy', href: '/anatomy', icon: Activity },
  { name: 'My Documents', href: '/documents', icon: BookOpen },
  { name: 'Exam Planner', href: '/planner', icon: CalendarDays },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-parchment border-r border-medical-brown/10 h-full flex flex-col hidden md:flex">
      <div className="p-6">
        <h1 className="text-2xl font-serif font-bold text-medical-teal flex items-center gap-2">
          <Activity className="w-6 h-6" /> Arivu
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive 
                  ? 'bg-medical-teal-light text-medical-teal font-medium' 
                  : 'text-medical-brown/80 hover:bg-black/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-medical-teal' : 'text-medical-muted'}`} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-medical-brown/10 text-xs text-center text-medical-muted font-sans">
        Arivu Beta v2.1
      </div>
    </div>
  );
};
