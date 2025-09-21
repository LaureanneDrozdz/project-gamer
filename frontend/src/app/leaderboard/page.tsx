import { LeaderboardType } from '@/types';
import Leaderboard from '../components/leaderboard/leaderboard';
import { apiFetch } from '@/lib/api';

const leaderboard: LeaderboardType[] = await apiFetch(
  '/user/leaderboard?limit=10'
);
export default function LeaderboardPage() {
  return (
    <section className="py-16 bg-white">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url('/assets/bg-leaderboard.webp')`,
          zIndex: 0,
        }}
      ></div>

      {/* Overlay with transparent color */}
      <div
        className="absolute inset-0 z-1"
        style={{ background: 'rgba(74, 32, 64, 0.6)' }}
      ></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 ">
        <h2 className="text-3xl font-bold  text-center text-white">
          Top Challengers
        </h2>
        <Leaderboard
          leaderboard={leaderboard}
          color={'text-white'}
          backgroundColor={'bg-transparent'}
          centered={true}
        />
      </div>
    </section>
  );
}
