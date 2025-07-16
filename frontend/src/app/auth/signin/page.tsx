"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      router.replace("/");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sign In Toggle */}
      <div className="mb-6">
        <button className="bg-primary text-blanc px-4 py-2 rounded font-medium">
          CONNEXION
        </button>
        <button
          onClick={() => router.push("/auth/signup")}
          className="bg-white text-noir px-4 py-2 ml-2 font-medium"
        >
          INSCRIPTION
        </button>
      </div>

      {/* Logo */}
      <div className="flex items-center mb-8">
        <div className="bg-primary rounded-full p-2 w-10 h-10 flex items-center justify-center text-blanc font-bold">
          GC
        </div>
        <span className="ml-2 text-gray-800 font-medium">GamerChallenges</span>
      </div>

      <h2 className="text-xl font-bold mb-8">Connectez-vous à votre compte</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
            Email ou nom
          </label>
          <input
            data-testid='loginUserMail'
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
            data-testid='loginUserPassword'
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
          data-testid='loginButton'
          className="w-full bg-cta text-noir py-3 rounded font-semibold"
        >
          CONNEXION
        </button>
      </form>

      <div className="flex-1"></div>

      <p className="text-sm text-center text-gray-600 mt-4">
        Pas encore de compte ?{" "}
        <Link href="/auth/signup" className="text-secondary font-medium">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
