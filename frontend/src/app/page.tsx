import Hero from './components/hero/Hero';
import Leaderboard from './components/leaderboard/leaderboard';
import { Challenge, LeaderboardItemType } from '@/types';
import { apiFetch } from '@/lib/api';
import ChallengesList from './components/challenges/challengeList';

export default async function Home() {
  const [leaderboard, challenges]: [LeaderboardItemType[], Challenge[]] =
    await Promise.all([
      apiFetch('/user/leaderboard?limit=10', { next: { revalidate: 60 } }),
      apiFetch('/challenge', { next: { revalidate: 60 } }),
    ]);
  return (
    <>
      <Hero />

      <main className="w-full md:my-11 px-4 md:px-10 lg:px-20 xxl:px-40 py-7">
        {/* Section Challenges */}
        <section aria-labelledby="trending-challenges">
          <h3 className="text-2xl font-bold mb-6 lg:mb-8" id="trending-challenges">
            {' '}
            Défis tendance
          </h3>
          <ChallengesList challenges={challenges} />
        </section>
        {/* /Section Challenges */}
        {/* Section Leaderboard */}
        <section className='mt-20'>
          <h3 className="text-2xl font-bold mb-6 lg:mb-8">Leaderboard</h3>

          <div className="bg-white rounded-xl md:p-6">
            <Leaderboard
              leaderboard={leaderboard}
              color="text-gray-600"
              backgroundColor="bg-white"
              centered={false}
            />
          </div>
        </section>

        {/* /Section Leaderboard */}
      </main>
    </>
  );
}
