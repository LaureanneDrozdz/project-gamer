'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { User } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AccountDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const [userObject, setUserObject] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user === null) {
      router.replace('/auth/signin');
      return;
    }

    if (user) {
      apiFetch(`/user/${user.id}`)
        .then(setUserObject)
        .catch((err) => {
          console.error('Erreur lors du chargement du userObject :', err);
        });
    }
  }, [isLoading, user, router]);

  if (isLoading) return <p>Loading…</p>;
  if (!user) return null;

  return (
    <main className="mt-[10%] w-full max-w-2xl mx-auto bg-blanc rounded-xl shadow-lg p-8 flex flex-col gap-8">
      {/* Profile */}
      <div className="flex items-center gap-6">
        <img
          src={user.avatar_url}
          alt="Avatar"
          className="w-20 h-20 rounded-full border-4 border-primary shadow"
        />
        <div>
          <h1 className="text-3xl font-bold font-logo text-primary">
            {user.name}
          </h1>
          <p className="text-secondary font-secondary">{user.email}</p>
          <p className="text-xs text-noir/60 mt-1">
            Membre depuis : {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-6 justify-between">
        <div className="flex-1 min-w-[120px] bg-primary/10 rounded-lg p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-primary">
            {userObject?.challenges?.length ?? 0}
          </span>
          <span className="text-sm text-noir/70">Challenges créés</span>
        </div>
        <div className="flex-1 min-w-[120px] bg-secondary/10 rounded-lg p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-secondary">
            {userObject?.participations?.length ?? 0}
          </span>
          <span className="text-sm text-noir/70">Participations</span>
        </div>
        <div className="flex-1 min-w-[120px] bg-cta/10 rounded-lg p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-cta">
            {userObject?.votes?.length ?? 0}
          </span>
          <span className="text-sm text-noir/70">Votes</span>
        </div>
      </div>

      {/* Mes Challenges */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-primary mb-4">Mes Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userObject?.challenges.map((challenge) => (
            <a href={`/details/${challenge.id}`}>
              <div
                key={challenge.id}
                className="bg-background rounded-lg p-4 shadow transform transition-transform hover:scale-105 hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold">{challenge.title}</h3>

                <p className="text-sm text-secondary">
                  {challenge.game} - {challenge.difficulty}
                </p>
                <p className="mt-2 text-noir">{challenge.description}</p>
                {challenge.image_url && (
                  <img
                    src={challenge.image_url}
                    alt={challenge.title}
                    className="mt-2 w-full h-32 object-cover rounded"
                  />
                )}
                {/* <span
                className={`mt-2 inline-block px-2 py-1 text-xs rounded ${
                  challenge.validated
                    ? 'bg-green-200 text-green-800'
                    : 'bg-yellow-200 text-yellow-800'
                }`}
              >
                {challenge.validated ? 'Validé' : 'En attente'}
              </span> */}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Mes Participations */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Mes Participations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userObject?.participations.map((part) => (
            <a href={`/details/${part.challenge_id}`}>
              <div
                key={part.id}
                className="bg-background rounded-lg p-4 shadow transform transition-transform hover:scale-105 hover:shadow-lg"
              >
                <p className="text-white">{part.description}</p>

                <a
                  href={part.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-cta font-semibold hover:underline"
                >
                  Voir la vidéo
                </a>
                {/* <span
                className={`mt-2 inline-block px-2 py-1 text-xs rounded ${
                  part.validated
                    ? 'bg-green-200 text-green-800'
                    : 'bg-yellow-200 text-yellow-800'
                }`}
              >
                {part.validated ? 'Validée' : 'En attente'}
              </span> */}
              </div>
            </a>
          ))}
        </div>
      </section>

      <button
        onClick={logout}
        className="px-3 py-1 bg-red-500 text-white rounded self-start hover:bg-red-600 transition"
      >
        Déconnexion
      </button>
    </main>
  );
}
