'use client';

import LeaderboardItem from './leaderboardItem';

type LeaderboardItem = {
  avatar_url: string;
  userName: string;
  score: number;
};

type LeaderboardProps = {
  leaderboard: LeaderboardItem[];
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
      <div className="overflow-x-auto">
        <table className="w-full ">
          <thead></thead>
          <tbody className={`divide-y divide-gray-200 ${color}`}>
            {leaderboard.map(({ avatar_url, userName, score }, index) => (
              <LeaderboardItem
                imageUser={avatar_url}
                username={userName}
                score={score}
                index={index}
                key={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
