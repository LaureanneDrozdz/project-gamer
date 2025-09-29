'use client';
import { memo, useState } from 'react';
import { VoteButton } from '../button/voteButton';

type ParticipationCardProps = {
  link: string;
  title: string;
  nbVotes: number;
  participationId: string;
  userName?: string;
};
const extractIdVideo = (link: string) => {
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&\n?#]+)/;
  const match = link.match(regex);
  const videoId = match ? match[1] : undefined;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};

const ParticipationCard = memo(
  ({
    link,
    title,
    nbVotes,
    participationId,
    userName,
  }: ParticipationCardProps) => {
    const [votesCount, setVotesCount] = useState<number>(nbVotes);
    const onVoteChange = (hasVoted: boolean) => {
      setVotesCount((prevCount) => (hasVoted ? prevCount + 1 : prevCount - 1));
    };
    return (
      <div
        className="bg-white rounded-xl shadow-md overflow-hidden w-[95%] mx-auto max-w-sm min-h-[350px]"
        role="listitem"
        aria-label={`Participation : ${title}${userName ? ` par ${userName}` : ''}`}
      >
        <div className="relative h-50 w-full">
          <div className="relative w-full pb-[56.25%] overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full border-0"
              src={extractIdVideo(link)}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              aria-label={`Vidéo YouTube de la participation ${title}`}
              title={`Vidéo de participation : ${title}`}
            ></iframe>
          </div>
        </div>
        <div className="p-4 space-y-1 mt-4">
          {userName && (
            <p className="text-sm text-gray-500 px-2">Par {userName}</p>
          )}
          <h3 className="text-lg font-semibold px-2">{title}</h3>
          <p className="text-sm text-gray-600 px-2 mt-3 flex items-center">
            <VoteButton
              targetId={participationId}
              targetType="PARTICIPATION"
              onVoteChange={onVoteChange}
            />
            {votesCount} votes
          </p>
        </div>
      </div>
    );
  }
);

ParticipationCard.displayName = 'ParticipationCard';

export default ParticipationCard;
