import { ReactNode } from 'react';

export const metadata = {
  title: 'Challenges - GamerChallenges',
  description:
    'Consultez les challenges et le classement des meilleurs gamers sur GamerChallenges et relevez le défi !',
};

export default function ChallengesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
