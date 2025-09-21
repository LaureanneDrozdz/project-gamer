'use client';

import { faMedal, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

type LeaderboardItemProps = {
  index: number;
  imageUser: string;
  username: string;
  score: number;
};

const LeaderboardItem = ({
  index,
  imageUser,
  username,
  score,
}: LeaderboardItemProps) => {
  return (
    <tr key={index}>
      <td className="px-2 py-4 whitespace-nowrap text-center">
        <div className="flex items-center">
          {index + 1 <= 3 ? (
            <FontAwesomeIcon
              icon={faMedal}
              className={`mr-1 ${
                index + 1 === 1
                  ? 'text-yellow-400'
                  : index + 1 === 2
                    ? 'text-gray-400'
                    : 'text-amber-700'
              }`}
            />
          ) : (
            <span>{index + 1}</span>
          )}
        </div>
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Image
            src={imageUser}
            alt={username}
            width={40}
            height={40}
            className="rounded-full mr-3 object-cover"
          />
          <div>
            <div className="text-sm font-medium">{username}</div>
          </div>
        </div>
      </td>
      <td className="pl-6 pr-2 py-4 whitespace-nowrap">
        <div className="text-sm ">
          {score}
          <span className="ml-2">
            <FontAwesomeIcon icon={faTrophy} />
          </span>
        </div>
      </td>
    </tr>
  );
};

export default LeaderboardItem;
