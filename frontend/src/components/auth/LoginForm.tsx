'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Stethoscope, Lock, Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 medical-card bg-white/80 backdrop-blur-sm border-medical-teal/10">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-medical-teal/10 rounded-full flex items-center justify-center mb-4">
          <Stethoscope className="w-8 h-8 text-medical-teal" />
        </div>
        <h1 className="text-3xl font-serif text-medical-brown">Welcome Back</h1>
        <p className="text-medical-muted text-sm mt-2">Sign in to your AI Medical Copilot</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="yourname@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="rounded-sm border-medical-teal" />
            <label htmlFor="remember" className="text-medical-muted cursor-pointer">Remember me</label>
          </div>
          <Link href="/auth/forgot-password" title="Coming soon" className="text-medical-teal hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full h-12 text-lg group" isLoading={isLoading}>
          Login to Arivu
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="text-center text-sm text-medical-muted pt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-medical-teal font-semibold hover:underline">
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
};
