'use client';

import { LeaderboardItemType } from '@/types';
import LeaderboardItem from './leaderboardItem';

type LeaderboardProps = {
  leaderboard: LeaderboardItemType[];
  color: string;
  backgroundColor: string;
  centered: boolean;
};

const Leaderboard = ({
  leaderboard,
  color,
  backgroundColor,
  centered,
}: LeaderboardProps) => {
  return (
    <div
      className={` rounded-lg overflow-hidden ${
        centered ? 'max-w-4xl mx-auto' : ''
      } ${backgroundColor} mt-4`}
    >
      <div>
        <table className="w-full" aria-label="Classement des joueurs">
          <caption className="sr-only">Classement des joueurs</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Rang</th>
              <th scope="col">Joueur</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-gray-200 ${color}`}>
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  Aucun joueur dans le classement pour le moment.
                </td>
              </tr>
            ) : (
              leaderboard.map(({ avatar_url, userName, score }, index) => (
                <LeaderboardItem
                  imageUser={avatar_url}
                  username={userName}
                  score={score}
                  index={index}
                  key={index}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
