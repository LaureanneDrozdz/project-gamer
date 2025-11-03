import Image from 'next/image';
import { memo } from 'react';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Challenge } from '@/types';
import formatDate from '@/lib/formatDate';

type ChallengeHeaderProps = {
  challenge: Challenge;
};

const ChallengeHeader = memo(function ChallengeHeader({
  challenge,
}: ChallengeHeaderProps) {
  const participations = challenge?.participations?.length ?? 0;
  const creatorName =
    typeof challenge?.creator === 'object'
      ? challenge.creator.userName
      : challenge?.creator;

  const formattedDate = challenge?.created_at
    ? formatDate(challenge.created_at, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'date inconnue';

  return (
    <>
      {/** Hero section */}
      <section
        className="relative px-2 py-3 md:px-4 md:py-2"
        aria-label="Image du challenge"
      >
        <div className="flex justify-center items-center relative w-full h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden bg-radial-[at_50%_50%] from-secondary via-primary to-black shadow-[inset_0_0_400px_rgba(0,0,0,1)]">
          <Image
            src={challenge.image_url || '/details/default_image.webp'}
            alt={
              challenge.title
                ? `Image du challenge ${challenge.title}`
                : 'Image par défaut du challenge'
            }
            width={600}
            height={400}
            priority
            fetchPriority="high"
            className="w-auto h-[90%] object-cover mx-auto rounded-3xl shadow-[0px_0px_15px_rgba(0,0,0,0.50)] ring-2 ring-secondary shadow-secondary"
          />
          <div
            aria-label="Statut du challenge : en cours"
            className="absolute top-4 left-4 bg-secondary shadow-[0px_0px_15px_rgba(0,0,0,0.1)] ring-2 ring-primary shadow-secondary text-white text-xs px-3 py-1 rounded-full font-semibold font-primary"
          >
            En cours
          </div>
          <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-75 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-primary">
            <FontAwesomeIcon icon={faUsers} aria-hidden="true" />
            <span>
              {participations ?? 0} {''}
              participations
            </span>
          </div>
        </div>
      </section>
      {/** Title and creator section */}
      <section
        className="relative px-2 py-3 md:px-4 md:py-4"
        aria-labelledby="challenge-header-title"
        role="region"
      >
        <h1
          id="challenge-title"
          className="text-3xl md:text-4xl font-bold mb-2 font-primary"
        >
          {challenge.title || 'Titre du challenge inconnu'}
        </h1>
        <p className="text-sm dark:text-white font-secondary">
          Créé par {creatorName || 'Inconnu'} • {formattedDate}
        </p>
      </section>
    </>
  );
});

ChallengeHeader.displayName = 'ChallengeHeader';
export default ChallengeHeader;
