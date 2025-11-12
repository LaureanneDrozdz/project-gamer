'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import AuthHeader from '@/app/components/auth/authHeader';
import LoginForm from '@/app/components/auth/Form/loginForm';

export default function SignInPage() {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(email: string, password: string) {
    setError('');
    try {
      await login({ email, password });
      router.replace('/');
    } catch {
  
      setError( 'Erreur lors de la connexion'
      );
    }
  }

  return (
    <div className="flex flex-col h-full">
      <AuthHeader active="signin" title="Connectez-vous à votre compte" />
      <LoginForm onLogin={handleSubmit} loginError={error} />
    </div>
  );
}
