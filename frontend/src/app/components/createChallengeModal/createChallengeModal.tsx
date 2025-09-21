'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import Select from 'react-select';
import { fetchGames } from '@/lib/games';

type Props = {
  label?: string;
  className?: string;
};

type GameOption = {
  label: string;
  value: {
    name: string;
    image: string;
  };
};

export default function CreateChallengeModal({
  label = 'Créer un challenge',
  className = '',
}: Props) {
  const { user } = useAuth();
  const [submitError, setSubmitError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [games, setGames] = useState<GameOption[]>([]);
  const [game, setGame] = useState<GameOption | null>(null);
  const [difficulty, setDifficulty] = useState('EASY');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGames()
      .then((data) => {
        const options = data.results.map((game: any) => ({
          label: game.name,
          value: {
            name: game.name,
            image: game.background_image,
          },
        }));
        setGames(options);
      })
      .catch((err) => console.error('Error fetching games:', err));
  }, []);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setSubmitError(err.message || 'Erreur lors de la soumission');
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(true)} className="cta-button">
        Créer un challenge
      </button>

      {isOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
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
              </div>
            </div>
          </div>,
          document.getElementById('modal-root') as HTMLElement
        )}
    </div>
  );
}
