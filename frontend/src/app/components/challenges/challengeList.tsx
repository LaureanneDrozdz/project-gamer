'use client';

import { useState, useMemo } from 'react';
import { Challenge } from '@/types';
import ChallengeCard from './challengeCard';
import { ChallengeFilters } from './challengeFilters';

type ChallengesListProps = {
  challenges: Challenge[];
  showFilters?: boolean;
};

export default function ChallengesList({
  challenges,
  showFilters,
}: ChallengesListProps) {
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
      {showFilters && <ChallengeFilters filter={filter} onChange={setFilter} />}
      <div
        className="flex flex-wrap justify-start gap-6"
        role="list"
        id="challenge-list"
        aria-label="Liste des challenges"
      >
        {visibleChallenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
        {filteredChallenges.length === 0 && (
          <p className="text-gray-600 mt-2" role="status">
            Aucun challenge ne correspond aux critères sélectionnés.
          </p>
        )}
      </div>

      {showFilters && visibleCount < filteredChallenges.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-6 py-2 rounded-full font-semibold bg-cta text-noir hover:bg-cta/10 border-2 border-solid border-cta transition hover:text-cta"
            aria-controls="challenge-list"
            aria-label="Voir plus de challenges"
          >
            Voir plus
          </button>
        </div>
      )}
    </>
  );
}
