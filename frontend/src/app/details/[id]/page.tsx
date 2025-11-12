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
      <div className="container mx-auto px-2 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <ChallengeHeader challenge={challenge} />
        </div>

        {/* Left column: info then participation form */}
        <div className="md:col-span-1">
          <ChallengeInfoSide challenge={challenge} />
        </div>

        <section className="md:col-span-1">
           <ParticipationsGrid challenge={challenge} />
          
        </section>

        {/* Right column: participations list spans the two rows on md+ */}
        <section className="md:col-start-1 md:row-span-2 md:pl-4">
          <ParticipationBlock challengeId={challengeId} />
        </section>
      </div>
    </main>
  );
}
