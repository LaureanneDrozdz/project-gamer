'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, setToken, removeToken } from '@/lib/auth';
import { apiFetch as baseApiFetch } from '@/lib/api';
import { Challenge, Participation, Vote } from '@/types';

interface User {
  id: string;
  userName: string;
  email: string;
  created_at: string;
  avatar_url: string;
  challenges: Challenge[];
  participations: Participation[];
  votes: Vote[];
  role: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login(data: { email: string; password: string }): Promise<void>;
  signup(data: {
    userName: string;
    email: string;
    password: string;
  }): Promise<void>;
  logout(): void;
  apiFetch: typeof baseApiFetch;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. On mount, check for a token. If present, call /auth/me (or similar) to populate “user”.
  // 1) On mount, *only* fetch
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    baseApiFetch('/auth/me', { method: 'GET' })
      .then((json) => {
        setUser({
          id: json.id,
          userName: json.name,
          email: json.email,
          created_at: json.created_at,
          avatar_url: json.avatar_url,
          challenges: json.challenges,
          participations: json.participations,
          votes: json.votes,
          role: json.roles,
        });
      })
      .catch(() => {
        removeToken();
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // ← only on first mount

  // 2) Once we know “loading is done & we got a user” → dashboard
  useEffect(() => {
    if (!isLoading && user) {
      // router.replace("/account/dashboard");
    }
  }, [isLoading, user, router]);

  // 2. Wrap “apiFetch” so that if any call returns 401, we clear token & redirect
  async function apiFetch(path: string, options: RequestInit = {}) {
    try {
      return await baseApiFetch(path, options);
    } catch (error: unknown) {
      // Naively detect “Unauthorized” by checking status text or including a custom field.
      // If you modify baseApiFetch to throw an Error that contains status, use that.
      if (error instanceof Error && error.message.includes('401')) {
        //force logout
        removeToken();
        setUser(null);
        router.push('/auth/signin');
      }
      throw error;
    }
  }

  //lorsque login,
  // store token, setUser(, et push le navigateur to /dashboard (la homepage devrait etre /dashboard).
  async function login(data: { email: string; password: string }) {
    // 1) hit login → get the token
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    const { accessToken } = await res.json();

    // 2) store it
    setToken(accessToken);

    // 3) *now* fetch the real user profile
    const profile = await baseApiFetch('/auth/me', { method: 'GET' });
    setUser({
      id: profile.id,
      userName: profile.name,
      email: profile.email,
      created_at: profile.created_at,
      avatar_url: profile.avatar_url,
      challenges: profile.challenges,
      participations: profile.participations,
      votes: profile.votes,
      role: profile.roles,
    });
  }

  async function signup(data: {
    userName: string;
    email: string;
    password: string;
  }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Signup failed');
    }
    const { accessToken } = await res.json();
    setToken(accessToken);
    // Fetch “/auth/me”
    const profile = await baseApiFetch('/auth/me', { method: 'GET' });
    setUser({
      id: profile.id,
      userName: profile.name,
      email: profile.email,
      created_at: profile.created_at,
      avatar_url: profile.avatar_url,
      challenges: profile.challenges,
      participations: profile.participations,
      votes: profile.votes,
      role: profile.roles,
    });
  }

  function logout() {
    removeToken();
    setUser(null);
    router.push('/auth/signin');
  }

  const value: AuthContextValue = {
    user,
    isLoading,
    login,
    signup,
    logout,
    apiFetch,
    isLoggedIn: user !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
