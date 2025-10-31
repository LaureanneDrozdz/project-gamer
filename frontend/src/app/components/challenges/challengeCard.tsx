'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Challenge } from '@/types';
import formatDate from '@/lib/formatDate';

type ChallengeCardProps = {
  challenge: Challenge;
};

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const participationCount = challenge.participations?.length ?? 0;
  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };
  const challengeDetailsId = `challenge-details-${challenge.id}`;

  return (
    <Link
      href={`/details/${challenge.id}`}
      className="block group"
      key={challenge.id}
    >
      <div
        className="bg-white rounded-xl shadow-md overflow-hidden w-[95%] mx-auto max-w-sm group-hover:shadow-lg transition-shadow"
        role="listitem"
        aria-label={`Challenge ${challenge.title}`}
        aria-describedby={challengeDetailsId}
      >
        <div className="relative h-40 w-full">
          <Image
            src={challenge.image_url || '/details/default_image.webp'}
            aria-hidden="true"
            alt={challenge.title || 'Image du challenge'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
            fetchPriority="low"
          />
        </div>
        <div className="p-4 space-y-1">
          <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full">
            {challenge.game}
          </span>

          <span
            className={`inline-block text-black text-xs px-2 py-1 rounded-full ml-2 ${getDifficultyBg(challenge.difficulty)}`}
          >
            {challenge.difficulty}
          </span>

          <p className="text-lg font-semibold text-primary">
            {challenge.title}
          </p>
          <p className="text-md text-primary">
            Créé le: {formatDate(challenge.created_at)}
          </p>
          <p className="text-sm text-gray-600">
            {participationCount} participation
            {participationCount > 1 ? 's' : ''}
          </p>

          {/* Informations accessibles pour les lecteurs d'écran */}
          <div id={challengeDetailsId} className="sr-only">
            Jeu : {challenge.game}, Difficulté : {challenge.difficulty},{' '}
            {participationCount} participation
            {participationCount > 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChallengeCard;
