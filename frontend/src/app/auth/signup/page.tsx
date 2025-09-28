'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthHeader from '@/app/components/auth/authHeader';
import SignUpForm from '@/app/components/auth/Form/signUpForm';

export default function SignUpPage() {
  const { signup } = useAuth();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSignup(
    userName: string,
    email: string,
    password: string
  ) {
    setError('');
    try {
      await signup({ userName, email, password });
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <AuthHeader active="signup" title="Crée ton compte" />
      <SignUpForm onSignup={handleSignup} signupError={error} />
    </div>
  );
}
