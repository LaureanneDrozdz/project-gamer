"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthHeader from '@/app/components/auth/authHeader';
import LoginForm from '@/app/components/auth/Form/loginForm';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api';

export default function AdminSignInPage() {
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useAuth();

  async function handleSubmit(email: string, password: string) {
    setError('');
    try {
      const res = await apiFetch(`/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Admin login failed');
      }

      const me = await apiFetch(`/auth/admin/me`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!me.ok) throw new Error('Unable to fetch profile after login');
      const profile = await me.json();
      setUser(profile);
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
