import { ReactNode } from 'react';

export const metadata = {
  title: 'Leaderboard - GamerChallenges',
  description:
    'Consultez le classement des meilleurs gamers sur GamerChallenges. Découvrez les top joueurs, leurs scores et suivez les compétitions en direct !',
};

export default function LeaderboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
