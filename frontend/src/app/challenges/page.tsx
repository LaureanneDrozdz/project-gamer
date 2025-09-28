import { Challenge } from '@/types';
import { apiFetch } from '@/lib/api';
import ChallengesList from '../components/challenges/challengeList';

export default async function ChallengesView() {
  const challenges: Challenge[] = await apiFetch('/challenge');

  return (
    <section className="w-4/5 mx-auto my-11">
      <div className="flex items-center justify-between mb-6">
        <h1 id="challenges-heading" className="text-xl font-bold">
          Challenges
        </h1>
        <ChallengesList challenges={challenges} showFilters={true} />
      </div>
    </section>
  );
}
