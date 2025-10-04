import Link from 'next/link';
import React, { useState } from 'react';

type SignUpFormProps = {
  onSignup: (
    userName: string,
    email: string,
    password: string
  ) => Promise<void>;
  signupError?: string;
};

export default function SignUpForm({ onSignup, signupError }: SignUpFormProps) {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(userName, email, password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-labelledby="auth-header-title"
    >
      {signupError && (
        <p
          id="signup-error"
          className="text-red-500 text-sm"
          aria-live="assertive"
        >
          {signupError}
        </p>
      )}

      <div>
        <label htmlFor="name" className="label">
          Nom d&apos;utilisateur
        </label>
        <input
          id="name"
          className="input"
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          aria-invalid={!!signupError}
          aria-describedby={signupError ? 'signup-error' : undefined}
        />
      </div>

      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          aria-invalid={!!signupError}
          aria-describedby={signupError ? 'signup-error' : undefined}
        />
      </div>

      <div>
        <label htmlFor="password" className="label">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          aria-invalid={!!signupError}
          aria-describedby={signupError ? 'signup-error' : undefined}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-cta text-noir py-3 rounded font-semibold"
      >
        INSCRIPTION
      </button>

      <p className="text-sm text-center text-gray-600 mt-4">
        Vous avez déjà un compte ?{' '}
        <Link href="/auth/signin" className="text-primary font-medium">
          Connexion
        </Link>
      </p>
    </form>
  );
}
