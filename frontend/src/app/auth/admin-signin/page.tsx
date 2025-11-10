"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthHeader from '@/app/components/auth/authHeader';
import LoginForm from '@/app/components/auth/Form/loginForm';

export default function AdminSignInPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(email: string, password: string) {
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Admin login failed');
      }
      router.replace('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la connexion admin');
    }
  }

  return (
    <div className="flex flex-col h-full">
      <AuthHeader active="signin" title="Connexion Admin" />
      <div className="max-w-md mx-auto w-full p-6">
        <LoginForm onLogin={handleSubmit} loginError={error} />
      </div>
    </div>
  );
}
