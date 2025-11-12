import { LeaderboardItemType } from '@/types';
import Leaderboard from '../components/leaderboard/leaderboard';
import { apiFetch } from '@/lib/api';
import Image from 'next/image';

export default async function LeaderboardPage() {
  const leaderboard: LeaderboardItemType[] = await apiFetch(
    '/user/leaderboard?limit=10',
    { next: { revalidate: 60 } }
  );
  return (
    <section className="py-16 bg-white relative min-h-screen" role="main">
      {/* Background image */}
      <div className="absolute inset-0 bg-cover bg-center z-0">
        <Image
          src="/assets/bg-leaderboard.webp"
          alt=""
          aria-hidden="true"
          fill
          objectFit="cover"
          priority
          fetchPriority="high"
          className="object-cover"
        />
      </div>

      {/* Overlay with transparent color */}
      <div
        className="absolute inset-0 z-1"
        style={{ background: 'rgba(74, 32, 64, 0.6)' }}
        aria-hidden="true"
      ></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 ">
        <h1 className="text-3xl font-bold  text-center text-white">
          Top Challengers
        </h1>

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
