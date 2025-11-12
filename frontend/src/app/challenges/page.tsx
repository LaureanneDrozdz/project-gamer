import { Challenge } from '@/types';
import { apiFetch } from '@/lib/api';
import ChallengesList from '../components/challenges/challengeList';

export default async function ChallengesView() {
  const challenges: Challenge[] = await apiFetch('/challenge');

  return (
    <section className="w-4/5 mx-auto my-11">
      <div className="flex flex-col md:flex-col  justify-between mb-6">
        <h1 id="challenges-heading" className="text-4xl font-bold text-left mb-2 lg:mb-6">
          Challenges
        </h1>
        <ChallengesList challenges={challenges} showFilters={true} />
      </div>
    </section>
  );
}
