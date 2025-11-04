'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { fetchGames } from '@/lib/games';
import { apiFetch } from '@/lib/api';
type GameOption = {
  label: string;
  value: {
    name: string;
    image: string;
  };
};

export default function CreateChallengeModal() {
  const { user, isLoggedIn } = useAuth();
  const [submitError, setSubmitError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [games, setGames] = useState<GameOption[]>([]);
  const [game, setGame] = useState<GameOption | null>(null);
  const [difficulty, setDifficulty] = useState('EASY');
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    fetchGames()
      .then((data) => {
        const options = data.results.map((game) => ({
          label: game.name,
          value: {
            name: game.name,
            image: game.background_image,
          },
        }));
        setFetchError('');
        setGames(options);
      })
      .catch(() => {
        setFetchError('Erreur lors de la récupération des jeux');
      });
  }, []);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    setSubmitError('');
    try {
      const challenge = await apiFetch('/challenge', {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          description: description,
          rules: rules,
          game: game?.value.name,
          image_url: game?.value.image,
          difficulty: difficulty,
          validated: false,
          user_id: user?.id,
        }),
      });

      if (challenge?.id) {
        router.push(`/details/${challenge.id}`);
      } else {
        throw new Error('Réponse inattendue du serveur');
      }
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : 'Erreur lors de la soumission'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          // If user is not logged in, show a login prompt modal
          if (!isLoggedIn) {
            setShowLoginPrompt(true);
            return;
          }
          setIsOpen(true);
        }}
        className="cta-base cta-button"
        aria-haspopup="dialog"
      >
        Créer un challenge
      </button>

      {isOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white  md:rounded-lg shadow-xl w-full max-w-lg p-6 relative h-screen md:h-auto">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                X
              </button>

              <h2 className="text-xl font-semibold mb-4 text-black  ">
                Créer un challenge
              </h2>

              <div className="space-y-4">
                <input
                  name="title"
                  placeholder="Titre"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
                <textarea
                  name="rules"
                  placeholder="Règles"
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
                {fetchError && (
                  <p
                    className="text-red-500 text-sm mb-2"
                    role="alert"
                    aria-live="assertive"
                  >
                    {fetchError}
                  </p>
                )}
                <Select
                  options={games}
                  onChange={setGame}
                  value={game}
                  placeholder="Recherchez un jeu"
                  isClearable
                />

                <select
                  name="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                >
                  <option value="EASY">Facile</option>
                  <option value="MEDIUM">Moyen</option>
                  <option value="HARD">Difficile</option>
                </select>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-[var(--cta)] text-[var(--noir)] py-2 rounded hover:bg-yellow-400  disabled:opacity-50"
                >
                  {loading ? 'Création...' : 'Créer'}
                </button>
                {submitError && (
                  <p
                    className="text-red-500 text-sm mt-2"
                    role="alert"
                    aria-live="assertive"
                  >
                    {submitError}
                  </p>
                )}
              </div>
            </div>
          </div>,
          document.getElementById('modal-root') as HTMLElement
        )}

      {showLoginPrompt &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
              role="dialog"
              aria-labelledby="login-prompt-title"
              aria-describedby="login-prompt-desc"
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl cursor-pointer"
                onClick={() => setShowLoginPrompt(false)}
                aria-label="Fermer"
                
              >
                X
              </button>

              <h2 id="login-prompt-title" className="text-xl font-semibold mb-4 text-black">
                Connexion requise
              </h2>

              <p id="login-prompt-desc" className="mb-4 text-gray-700">
                Vous devez être connecté·e pour créer un challenge.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="px-4 py-2 rounded border cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="px-4 py-2 rounded bg-[var(--cta)] text-[var(--noir)] cursor-pointer"
                >
                  Se connecter
                </button>
              </div>
            </div>
          </div>,
          document.getElementById('modal-root') as HTMLElement
        )}
    </div>
  );
}
