import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
      <div className="absolute inset-0 bg-parchment -z-10"></div>
      <LoginForm />
    </main>
  );
}
