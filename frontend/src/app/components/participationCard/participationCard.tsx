'use client';
import { apiFetch } from '@/lib/api';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/lib/auth-context';
import { Menu, Heart, Users, Trophy, Star } from 'lucide-react';
import { VoteButton } from '../button/voteButton';

type ParticipationCardProps = {
  link: string;
  title: string;
  nbVotes: number;
  challenge: string | null;
  participationId: string;
};

const ParticipationCard = ({
  link,
  title,
  nbVotes,
  challenge,
  participationId,
}: ParticipationCardProps) => {
  const { user } = useAuth();

  const extractIdVideo = (link: string) => {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&\n?#]+)/;
    const match = link.match(regex);
    const videoId = match ? match[1] : undefined;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-[95%] mx-auto max-w-sm min-h-[350px]">
      <div className="relative h-50 w-full">
        <div className="relative w-full pb-[56.25%] overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full border-0"
            src={extractIdVideo(link)}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>
      <div className="p-4 space-y-1 mt-4">
        {challenge && (
          <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full">
            {challenge}
          </span>
        )}
        <h3 className="text-lg font-semibold px-2">{title}</h3>
        <p className="text-sm text-gray-600 px-2 mt-3 flex items-center">
          <VoteButton targetId={participationId} targetType="PARTICIPATION" />
          {nbVotes} votes
        </p>
      </div>
    </div>
  );
};

export default ParticipationCard;
