'use client';

import { useState, useMemo } from 'react';
import { Challenge } from '@/types';
import ChallengeCard from '../challengeCard/challengeCard';

type ChallengesListProps = {
  challenges: Challenge[];
};

export default function ChallengesList({ challenges }: ChallengesListProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [filter, setFilter] = useState<'all' | 'with' | 'without'>('all');

  // Tri des challenges
  const sortedChallenges = useMemo(() => {
    return [...challenges].sort(
      (a, b) =>
        (b.participations?.length ?? 0) - (a.participations?.length ?? 0)
    );
  }, [challenges]);

  // Filtrage selon le filtre sélectionné
  const filteredChallenges = useMemo(() => {
    return sortedChallenges.filter((ch) => {
      if (filter === 'with') return (ch.participations?.length ?? 0) > 0;
      if (filter === 'without') return (ch.participations?.length ?? 0) === 0;
      return true;
    });
  }, [sortedChallenges, filter]);

  // Pagination
  const visibleChallenges = useMemo(
    () => filteredChallenges.slice(0, visibleCount),
    [filteredChallenges, visibleCount]
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Challenges</h2>
        <div className="space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1 rounded ${
              filter === 'all' ? 'bg-cta text-noir' : 'border'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('with')}
            className={`px-4 py-1 rounded ${
              filter === 'with' ? 'bg-cta text-noir' : 'border'
            }`}
          >
            Avec participations
          </button>
          <button
            onClick={() => setFilter('without')}
            className={`px-4 py-1 rounded ${
              filter === 'without' ? 'bg-cta text-noir' : 'border'
            }`}
          >
            Sans participation
          </button>
        </div>
      </div>

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
  );
}
