'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

type ChallengeCardProps = {
  id: string;
};

type Challenge = {
  id: string;
  game: string;
  title: string;
  participations: any[];
  image_url: string | null;
  created_at: string;
  participation: any[];
};

const ChallengeCard = ({ id }: ChallengeCardProps) => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/challenge/${id}`)
      .then((data) => setChallenge(data))

      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden w-[95%] mx-auto max-w-sm h-60 flex items-center justify-center">
        <span>Chargement...</span>
      </div>
    );
  }
  if (!challenge) {
    return null;
  }

  return (
    <Link href={`/details/${challenge.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden w-[95%] mx-auto max-w-sm group-hover:shadow-lg transition-shadow">
        <div className="relative h-40 w-full">
          <Image
            src={challenge.image_url || '/details/default_image.webp'}
            alt={challenge.title}
            fill
            className="object-fit"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-4 space-y-1">
          <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full">
            {challenge.game}
          </span>
          <h3 className="text-lg font-semibold text-primary">
            {challenge.title}
          </h3>
          <p className="text-md text-primary">
            Créé le:
            {new Date(challenge.created_at).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            {challenge.participations.length} participation
            {challenge.participations.length > 1 ? 's' : ''}
          </p>
          {/* <p className="text-sm text-gray-600">{challenge.participations.length} participants</p> */}
        </div>
      </div>
    </Link>
  );
};

export default ChallengeCard;
