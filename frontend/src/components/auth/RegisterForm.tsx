'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, GraduationCap, School, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    programme: 'MBBS',
    year: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.register(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-8 medical-card bg-white/80 backdrop-blur-sm border-medical-teal/10">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-medical-teal/10 rounded-full flex items-center justify-center mb-4">
          <GraduationCap className="w-8 h-8 text-medical-teal" />
        </div>
        <h1 className="text-3xl font-serif text-medical-brown text-center">Start Your Journey</h1>
        <p className="text-medical-muted text-sm mt-2 text-center">Join thousands of medical students using AI</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="Dr. John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="john@hospital.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Min. 6 characters"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          label="Medical College"
          name="college"
          placeholder="AIIMS, JIPMER, etc."
          value={formData.college}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-medical-brown/80">Programme</label>
            <select
              name="programme"
              className="px-3 py-2 bg-parchment-light border border-medical-brown/10 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal transition-all"
              value={formData.programme}
              onChange={handleChange}
              required
            >
              <option value="MBBS">MBBS</option>
              <option value="BDS">BDS</option>
              <option value="Nursing">Nursing</option>
              <option value="PharmD">PharmD</option>
              <option value="Allied">Allied Health</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-medical-brown/80">Year of Study</label>
            <select
              name="year"
              className="px-3 py-2 bg-parchment-light border border-medical-brown/10 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal transition-all"
              value={formData.year}
              onChange={handleChange}
              required
            >
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
              <option value={5}>Internship / Final</option>
            </select>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 text-lg group mt-4" isLoading={isLoading}>
          Create Account
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="text-center text-sm text-medical-muted pt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-medical-teal font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};
