'use client';

import { faMedal, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { memo } from 'react';

type LeaderboardItemProps = {
  index: number;
  imageUser: string;
  username: string;
  score: number;
};

const getMedalColor = (index: number) => {
  switch (index) {
    case 0:
      return 'text-yellow-400';
    case 1:
      return 'text-gray-400';
    case 2:
      return 'text-amber-700';
    default:
      return '';
  }
};

const LeaderboardItem = memo(
  ({ index, imageUser, username, score }: LeaderboardItemProps) => {
    return (
      <tr
        key={index}
        tabIndex={0}
       className="flex md:table-row flex-col rounded-lg md:rounded-nonemy-2 md:my-0 p-3 md:p-0  bg-white/5 md:bg-transparent backdrop-blur-sm hover:bg-primary/20 focus:bg-primary/30transition-colors
"
      >
        {/** Medal / Ranking */}
        <td className="px-2 py-4 whitespace-nowrap text-center">
          <div className="flex items-center">
            {index + 1 <= 3 ? (
              <FontAwesomeIcon
                icon={faMedal}
                className={`w-5 h-5 ${getMedalColor(index)}`}
                title={`Rang ${index + 1}`}
                aria-label={`Médaille du rang ${index + 1}`}
              />
            ) : (
              <span>
                <span className="sr-only">Rang</span>
                {index + 1}
              </span>
            )}
          </div>
        </td>
        {/** /Medal / Ranking */}
        {/** User Info */}
        <td className="px-2 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <Image
              src={imageUser}
              alt={`${username} avatar`}
              width={40}
              height={40}
              className="rounded-full mr-3 object-cover"
            />
            <div>
              <div className="text-sm font-medium">{username}</div>
            </div>
          </div>
        </td>
        {/** /User Info */}
        {/** Score */}
        <td className="pl-6 pr-2 py-4 whitespace-nowrap">
          <div className="text-sm md:">
            <span className="sr-only">Score :</span>
            {score}
            <span className="ml-2" title="Trophée" aria-label="Trophée">
              <FontAwesomeIcon icon={faTrophy} aria-hidden="true" />
            </span>
          </div>
        </td>
        {/** /Score */}
      </tr>
    );
  }
);

LeaderboardItem.displayName = 'LeaderboardItem';

export default LeaderboardItem;
