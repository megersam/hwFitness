'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
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
            />
          </div>
          <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700">
            Log In
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
