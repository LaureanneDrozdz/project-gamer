'use client';

import { useEffect, useState } from 'react';
import ChallengeCard from '../components/challengeCard/challengeCard';
import { Challenge } from '@/types';
import { apiFetch } from '@/lib/api';

export default function ChallengesView() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'with' | 'without'>('all');

  useEffect(() => {
    setLoading(true);
    apiFetch('/challenge')
      .then((data) => setChallenges(data))
      .finally(() => setLoading(false));
  }, []);

  const sortedChallenges = [...challenges].sort((a, b) => {
    if (b.participations.length !== a.participations.length) {
      return b.participations.length - a.participations.length;
    }
    const aLast =
      a.participations.length > 0
        ? Math.max(
            ...a.participations.map((p) => new Date(p.created_at).getTime())
          )
        : 0;
    const bLast =
      b.participations.length > 0
        ? Math.max(
            ...b.participations.map((p) => new Date(p.created_at).getTime())
          )
        : 0;
    return bLast - aLast;
  });

  const filteredChallenges = sortedChallenges.filter((ch) => {
    if (filter === 'with') return ch.participations.length > 0;
    if (filter === 'without') return ch.participations.length === 0;
    return true;
  });

  const visibleChallenges = filteredChallenges.slice(0, visibleCount);

  return (
    <section className="w-4/5 mx-auto my-11">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Challenges</h2>
        <div className="space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1 rounded ${filter === 'all' ? 'bg-cta text-noir' : 'border'}`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('with')}
            className={`px-4 py-1 rounded ${filter === 'with' ? 'bg-cta text-noir' : 'border'}`}
          >
            Avec participations
          </button>
          <button
            onClick={() => setFilter('without')}
            className={`px-4 py-1 rounded ${filter === 'without' ? 'bg-cta text-noir' : 'border'}`}
          >
            Sans participation
          </button>
        </div>
      </div>

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} id={challenge.id} />
            ))}
          </div>
          {visibleCount < filteredChallenges.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-2 rounded-full font-semibold bg-cta text-noir hover:bg-cta/10 border-2 border-solid border-cta transition hover:text-cta"
              >
                Voir plus
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
