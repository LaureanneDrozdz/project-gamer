'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import AuthHeader from '@/app/components/auth/authHeader';
import LoginForm from '@/app/components/auth/Form/loginForm';

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
      <LoginForm onLogin={handleSubmit} loginError={error} />
    </div>
  );
}
