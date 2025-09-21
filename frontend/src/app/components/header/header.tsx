'use client';

import Button from '../button/button';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <div className="bg-primary relative z-50">
      <header className="flex justify-between items-center px-8 py-4">
        <span className="logo">GamerChallenges</span>

        {/* Burger Menu Button */}
        <button
          className="md:hidden text-blanc z-10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-blanc hover:text-secondary">
            Accueil
          </Link>
          <Link href="/challenges" className="text-blanc hover:text-secondary">
            Challenges
          </Link>
          <Link href="/leaderboard" className="text-blanc hover:text-secondary">
            Leaderboard
          </Link>
        </nav>

        {/* Desktop Buttons or Profile */}
        <div className="hidden md:flex items-center space-x-2 relative">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center text-blanc focus:outline-none"
                aria-label="Ouvrir la page profil"
              >
                <img
                  src={user.avatar_url}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border-2 border-blanc"
                />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-2">
                  <Link
                    href="/account/dashboard"
                    className="block px-4 py-2 text-noir hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon Profil
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-noir hover:bg-gray-100"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Button label="Connexion" href="/auth/signin" variant="cta" />
              <Button label="Inscription" href="/auth/signup" variant="white" />
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } md:hidden absolute top-full left-0 right-0 bg-primary flex-col items-center py-4 space-y-4 z-10 shadow-lg`}
        >
          <Link href="/" className="text-blanc hover:text-secondary">
            Accueil
          </Link>
          <Link href="/challenges" className="text-blanc hover:text-secondary">
            Challenges
          </Link>
          <Link href="/leaderboard" className="text-blanc hover:text-secondary">
            Leaderboard
          </Link>

          <div className="flex flex-col space-y-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/account/dashboard"
                  className="block text-blanc hover:text-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mon Profil
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-blanc hover:text-secondary"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Button label="Connexion" href="/auth/signin" variant="cta" />
                <Button
                  label="Inscription"
                  href="/auth/signup"
                  variant="white"
                />
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
