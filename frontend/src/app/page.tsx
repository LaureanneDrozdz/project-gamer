'use client';

import { useEffect, useState, useMemo } from 'react';
import Hero from './components/hero/Hero';
import ChallengeCard from './components/challengeCard/challengeCard';
import Leaderboard from './components/leaderboard/leaderboard';
import { Challenge, LeaderboardType } from '@/types';
import { apiFetch } from '@/lib/api';

export default function Home() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardType[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [loadingChallenges, setLoadingChallenges] = useState(true);

  useEffect(() => {
    setLoadingLeaderboard(true);
    apiFetch('/user/leaderboard')
      .then((data) => setLeaderboard(data))
      .finally(() => setLoadingLeaderboard(false));
  }, []);

  useEffect(() => {
    setLoadingChallenges(true);
    apiFetch('/challenge')
      .then((data) => setChallenges(data))
      .finally(() => setLoadingChallenges(false));
  }, []);

  const sortedChallenges = useMemo(() => {
    return [...challenges].sort((a, b) => {
      const aParticipations = a.participations ?? [];
      const bParticipations = b.participations ?? [];

      if (bParticipations.length !== aParticipations.length) {
        return bParticipations.length - aParticipations.length;
      }

      const aLast =
        aParticipations.length > 0
          ? Math.max(
              ...aParticipations.map((p) => new Date(p.created_at).getTime())
            )
          : 0;

      const bLast =
        bParticipations.length > 0
          ? Math.max(
              ...bParticipations.map((p) => new Date(p.created_at).getTime())
            )
          : 0;

      return bLast - aLast;
    });
  }, [challenges]);

  return (
    <>
      <Hero />

      <main className="w-full my-11 px-7 py-7">
        {/* Section Challenges */}
        <section aria-labelledby="trending-challenges">
          <h3 className="text-2xl font-bold mb-6" id="trending-challenges">
            {' '}
            Défis tendance
          </h3>

          {loadingChallenges ? (
            <div role="status" aria-busy="true" aria-live="polite">
              Chargement des challenges ...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sortedChallenges.slice(0, visibleCount).map((challenge) => (
                  <ChallengeCard key={challenge.id} id={challenge.id} />
                ))}
              </div>

              {visibleCount < sortedChallenges.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="px-6 py-2 rounded-full font-semibold bg-cta text-noir hover:bg-cta/10 border-2 border-solid border-cta transition hover:text-cta"
                  >
                    Voir plus de challenges
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Section Leaderboard */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Leaderboard</h3>

          {loadingLeaderboard ? (
            <div role="status" aria-busy="true" aria-live="polite">
              Chargement du leaderboard ...
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6">
              <Leaderboard
                leaderboard={leaderboard}
                color="text-gray-600"
                backgroundColor="bg-white"
                centered={false}
              />
            </div>
          )}
        </section>
      </main>
    </>
  );
}
