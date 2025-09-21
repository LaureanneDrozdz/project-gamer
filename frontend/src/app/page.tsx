'use client';

import { useEffect, useState } from 'react';
import Button from './components/button/button';
import Hero from './components/hero/Hero';
import ChallengeCard from './components/challengeCard/challengeCard';
import Leaderboard from './components/leaderboard/leaderboard';
import ParticipationCard from './components/participationCard/participationCard';
import { Challenge, LeaderboardType } from '@/types';
import { apiFetch } from '@/lib/api';

export default function Home() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardType[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/user/leaderboard')
      .then((data) => setLeaderboard(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    apiFetch('/challenge')
      .then((data) => setChallenges(data))
      .finally(() => setLoading(false));
  }, []);

  // Trie les challenges d'abord par nombre de participations décroissant, puis par la date de la participation la plus récente
  const sortedChallenges = [...challenges].sort((a, b) => {
    // 1. Par nombre de participations décroissant
    if (b.participations.length !== a.participations.length) {
      return b.participations.length - a.participations.length;
    }
    // 2. Si égalité, par date de participation la plus récente décroissante
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

  // Garde que les challenges qui ont au moins une participation
  const filteredChallenges = sortedChallenges.filter(
    (ch) => ch.participations.length > 0
  );
  const visibleChallenges = filteredChallenges.slice(0, visibleCount);

  return (
    <>
      <Hero />
      <section className="w-4/5 mx-auto  my-11">
        <h2 className="text-xl font-bold mb-4 mt-10">Défi tendance</h2>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-6 ">
              {visibleChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} id={challenge.id} />
              ))}
            </div>
            {visibleCount < filteredChallenges.length && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-6 py-2 rounded-full font-semibold bg-cta text-noir hover:bg-cta/10 border-2 border-solid border-cta transition hover:text-cta"
                >
                  Voir plus de challenge
                </button>
              </div>
            )}
          </>
        )}

        <h2 className="text-xl font-bold mb-4 mt-10">Leaderboard</h2>
        <div className="container">
          <Leaderboard
            leaderboard={leaderboard}
            color="text-gray-600"
            backgroundColor="bg-white"
            centered={false}
          />
        </div>
      </section>
    </>
  );
}
