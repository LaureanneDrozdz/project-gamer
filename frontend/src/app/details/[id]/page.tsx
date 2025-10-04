import { apiFetch } from '@/lib/api';
import type { Challenge } from '@/types';
import ParticipationsGrid from '@/app/components/participations/ParticipationsGrid';
import ChallengeHeader from '@/app/components/challenge/ChallengeHeader';
import ChallengeInfoSide from '@/app/components/challenge/ChallengeInfoSide';
import ParticipationBlock from '@/app/components/participations/participationBlock';

type Params = Promise<{ id: string }>;

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const challenge: Challenge = await apiFetch(`/challenge/${params.id}`);
  return {
    title: `${challenge.title} - Gamer Challenges`,
    description: challenge.description || 'Détails du challenge',
  };
}

export default async function ChallengeDetailPage(props: { params: Params }) {
  const challengeId = (await props.params).id;
  const challenge: Challenge = await apiFetch(`/challenge/${challengeId}`);

  return (
    <main className="min-h-screen bg-white dark:bg-black dark:text-white">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-1">
          <ChallengeHeader challenge={challenge} />
          <ChallengeInfoSide challenge={challenge} />
        </div>
        <section className="md:col-span-1">
          <ParticipationBlock challengeId={challengeId} />
        </section>
        <section className="md:col-span-1">
          <ParticipationsGrid challenge={challenge} />
        </section>
      </div>
    </main>
  );
}
