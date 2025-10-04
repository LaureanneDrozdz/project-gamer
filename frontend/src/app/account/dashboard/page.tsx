'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { User } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import StatsCard from '@/app/components/dashboard/statCard';
import ProfileHeader from '@/app/components/dashboard/header';
import ChallengeCard from '@/app/components/challenges/challengeCard';
import { ParticipationCard } from '@/app/components/dashboard/participationCard';

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

  if (isLoading) {
    return (
      <p role="status" aria-live="polite">
        Chargement en cours…
      </p>
    );
  }

  if (!user) return null;

  return (
    <main className="mt-[10%] w-full max-w-2xl mx-auto bg-blanc rounded-xl shadow-lg p-8 flex flex-col gap-8">
      <ProfileHeader user={user} />

      {/* Stats */}
      <section
        aria-label="Statistiques de l'utilisateur"
        className="flex flex-wrap gap-6 justify-between"
      >
        <StatsCard
          label="Challenges créés"
          value={userObject?.challenges?.length ?? 0}
          color="primary"
        />
        <StatsCard
          label="Participations"
          value={userObject?.participations?.length ?? 0}
          color="secondary"
        />
        <StatsCard
          label="Votes"
          value={userObject?.votes?.length ?? 0}
          color="cta"
        />
      </section>

      {/* Mes Challenges */}
      <section aria-labelledby="mes-challenges-title">
        <h2
          id="mes-challenges-title"
          className="text-2xl font-bold text-primary mb-4"
        >
          Mes Challenges
        </h2>
        {userObject?.challenges?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userObject.challenges.map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
          </div>
        ) : (
          <p className="text-noir/60" role="status">
            Vous n&apos;avez pas encore créé de challenges.
          </p>
        )}
      </section>

      {/* Mes Participations */}
      <section aria-labelledby="mes-participations-title">
        <h2
          id="mes-participations-title"
          className="text-2xl font-bold text-primary mb-4"
        >
          Mes Participations
        </h2>
        {userObject?.participations?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userObject.participations.map((p) => (
              <ParticipationCard key={p.id} participation={p} />
            ))}
          </div>
        ) : (
          <p className="text-noir/60" role="status">
            Vous n&apos;avez pas encore participé à un challenge.
          </p>
        )}
      </section>

      {/* Logout */}

      <button
        type="button"
        onClick={() =>
          confirm('Voulez-vous vraiment vous déconnecter ?') && logout()
        }
        className="px-3 py-1 bg-red-500 text-white rounded self-start hover:bg-red-600 transition"
        aria-label="Se déconnecter du compte"
      >
        Déconnexion
      </button>
    </main>
  );
}
