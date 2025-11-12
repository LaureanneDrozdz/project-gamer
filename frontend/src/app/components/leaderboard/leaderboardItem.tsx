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
        className={
          "flex md:table-row flex-row flex-wrap md:flex-nowrap rounded-lg md:rounded-none my-2 md:my-0 p-3 md:p-0 bg-white/5 md:bg-transparent hover:bg-primary/20 focus:bg-primary/30 transition-colors"
        }
      >
        {/** Medal / Ranking */}
        <td className="flex-shrink-0 w-12 md:w-auto inline md:table-cell px-2 py-4 whitespace-nowrap text-center">
          <div className="flex items-center justify-center">
            {index + 1 <= 3 ? (
              <FontAwesomeIcon
                icon={faMedal}
                className={` ${getMedalColor(index)} drop-shadow-md`}
                aria-label={`Médaille du rang ${index + 1}`}
                size='2x'
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
      <td className="flex-1 min-w-0 inline md:w-auto px-2 py-4 whitespace-nowrap">
          <div className="flex flex-row items-center md:items-center">
            <Image
              src={imageUser}
              alt={`${username} avatar`}
              width={40}
              height={40}
              className="rounded-full mr-3 object-cover flex-shrink-0"
            />
            <div>
              <div className="text-sm font-medium">{username}</div>
            </div>
          </div>
        </td>
        {/** /User Info */}
        {/** Score */}
        <td className="flex-shrink-0 w-full md:w-auto pl-6 pr-2 py-4 whitespace-nowrap">
          <div className="flex items-center md:justify-end text-sm md:text-lg">
            <span className="sr-only">Score :</span>

            <span className="text-lg"><span className="font-bold mr-1">Score:</span>{score}</span>
            <span className="ml-2" title="Trophée" aria-label="Trophée">
              <FontAwesomeIcon
                icon={faTrophy}
                aria-hidden="true"
                className="drop-shadow-md text-yellow-600"
                size="lg"
              />
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
