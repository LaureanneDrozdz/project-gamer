import Link from 'next/link';
import React, { useState } from 'react';

type LoginFormProps = {
  onLogin: (emailOrUsername: string, password: string) => Promise<void>;
  loginError: string;
};

const LoginForm = ({ onLogin, loginError }: LoginFormProps) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(emailOrUsername, password);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        aria-labelledby="auth-header-title"
      >
        {loginError && (
          <p
            role="alert"
            aria-live="assertive"
            id="login-error"
            className="text-red-500 text-sm"
          >
            {loginError}
          </p>
        )}
        <div>
          <label htmlFor="email" className="label">
            Email ou nom d'utilisateur
          </label>
          <input
            type="text"
            id="email"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="input"
            aria-invalid={!!loginError}
            aria-describedby={loginError ? 'login-error' : undefined}
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            aria-invalid={!!loginError}
            aria-describedby={loginError ? 'login-error' : undefined}
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
      <p className="text-center text-sm mt-4 text-gray-700 font-secondary">
        Pas encore de compte ?{' '}
        <Link
          href="/auth/signup"
          className="text-primary hover:underline font-semibold"
        >
          Créer un compte
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
