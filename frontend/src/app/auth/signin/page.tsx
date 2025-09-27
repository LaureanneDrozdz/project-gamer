'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthHeader from '@/app/components/auth/authHeader';

export default function SignInPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      router.replace('/');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <AuthHeader active="signin" title="Connectez-vous à votre compte" />
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
            Email ou nom
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full border border-gray-200 rounded px-4 py-3"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm text-gray-600 mb-1"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full border border-gray-200 rounded px-4 py-3"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-cta text-noir py-3 rounded font-semibold"
        >
          CONNEXION
        </button>
      </form>

      <div className="flex-1"></div>

      <p className="text-sm text-center text-gray-600 mt-4">
        Pas encore de compte ?{' '}
        <Link
          href="/auth/signup"
          className="text-primary font-medium underline"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
