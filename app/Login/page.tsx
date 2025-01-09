'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
  
      // Save user data in cookies
      document.cookie = `user=${JSON.stringify(data)}; path=/;`;
  
      // Save user data in localStorage for additional frontend use
      localStorage.setItem('user', JSON.stringify(data));
  
      // Redirect based on role
      if (data.role === 'Admin') {
        window.location.href = '/Admin';
      } else if (data.role === 'Reception') {
        window.location.href = '/Reception';
      }
  
      toast.success('Login successful');
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
    setLoading(false);
  };








  return (
    <div className="min-h-screen bg-[#1E1E20] flex flex-col lg:flex-row items-center justify-center px-4">
      {/* Left: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-white space-y-8 p-6">
        <h2 className="text-3xl lg:text-5xl font-bold">Welcome Back</h2>
        <p className="text-lg lg:text-xl opacity-75">
          Log in to continue to your dashboard.
        </p>
        <form className="w-full max-w-sm space-y-6">
          <div>
            <Label htmlFor="email" className="block text-lg font-semibold mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="bg-[#2A2A2E] text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password" className="block text-lg font-semibold mb-2">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="bg-[#2A2A2E] text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
      </div>

      {/* Right: Image */}
      <div className="w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
        <Image
          src="/logo.png" // Replace with your actual image path
          alt="Logo"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>
    </div>
  );
}
