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
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h4 className="text-lg font-bold mb-4 text-center font-primary">
        Connectez-vous à votre compte
      </h4>
      {loginError && (
        <p className="text-red-500 text-sm text-center mb-4">{loginError}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1 font-secondary"
          >
            Email ou nom d'utilisateur
          </label>
          <input
            type="text"
            id="email"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary font-secondary"
            placeholder="Votre email ou nom"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1 font-secondary"
          >
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary font-secondary"
            placeholder="Votre mot de passe"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-full text-primary font-bold text-lg tracking-wide bg-cta hover:bg-yellow-600 transition-colors font-primary"
        >
          CONNEXION
        </button>
      </form>
      <p className="text-center text-sm mt-4 text-gray-700 font-secondary">
        Pas encore de compte ?
        <Link
          href="/auth/signup"
          className="text-secondary hover:underline font-semibold"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
