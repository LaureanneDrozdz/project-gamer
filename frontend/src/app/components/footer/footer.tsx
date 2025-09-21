'use client';

const footer = () => {
  return (
    <footer className="mt-auto border-t border-primary-600 py-4 px-8 z-50 bg-primary">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h1 className="text-blanc text-2xl font-bold font-logo">
          GamerChallenges
        </h1>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 text-center">
          <a
            href="/mentions-legales"
            className="text-blanc hover:text-secondary text-sm"
          >
            Mentions légales
          </a>
          <a
            href="/confidentialite"
            className="text-blanc hover:text-secondary text-sm"
          >
            Politique de confidentialité
          </a>
        </div>
      </div>
    </footer>
  );
};

export default footer;
