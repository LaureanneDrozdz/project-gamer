'use client';

import Link from 'next/link';

const footer = () => {
  return (
    <footer className="mt-auto py-4 px-8 z-50 bg-primary">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <span className="logo">GamerChallenges</span>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 text-center">
          <Link
            href="/mentions-legales"
            className="text-blanc hover:text-secondary text-sm"
            aria-label="Lire les mentions légales"
          >
            Mentions légales
          </Link>
          <Link
            href="/confidentialite"
            className="text-blanc hover:text-secondary text-sm"
            aria-label="Lire la politique de confidentialité"
          >
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default footer;
