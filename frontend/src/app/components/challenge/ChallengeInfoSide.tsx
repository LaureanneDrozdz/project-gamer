import { Challenge } from '@/types';
import ChallengeStatsBar from './ChallengeStatsBar';
import { memo } from 'react';

export type ChallengeInfoSideProps = {
  challenge: Challenge;
};

const ChallengeInfoSide = memo(function ChallengeInfoSide({
  challenge,
}: ChallengeInfoSideProps) {
  const getEndDate = (startDate: string | undefined): string => {
    if (!startDate) return 'Date de fin non disponible';
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + 1); // Ajoute 1 mois
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    
  
  };
  return (
    <>
      {/* Tags challenge */}
      <section
        className="flex flex-wrap gap-3 mb-8 p-4"
        aria-label="Informations principales sur le challenge"
      >
        <span
          aria-label={`Fin du challenge le ${getEndDate(challenge?.created_at)}`}
          className="bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold font-primary"
          role="status"
        >
          <span aria-hidden="true">🔴</span> FIN LE{' '}
          {getEndDate(challenge?.created_at)}
        </span>
        <span
          className="bg-secondary text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold font-primary"
          aria-label={`Jeu du challenge : ${challenge?.game || 'Jeu non spécifié'}`}
        >
          <span aria-hidden="true">🎮</span>{' '}
          {challenge?.game || 'Jeu non spécifié'}
        </span>
      </section>
      {/* Stats Bar */}
      <ChallengeStatsBar challenge={challenge} />
      {/* Description & Règles */}
      <section className="mb-8 p-4" aria-labelledby="challenge-desc-title">
        <h2
          id="challenge-desc-title"
          className="text-xl font-bold mb-4 font-primary"
        >
          Description & Règles
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4 font-secondary">
          {challenge?.description ||
            "Description du challenge absente, merci de contacter l'administrateur."}
        </p>
        <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-md">
          <p className="text-xl mt-1">🎯</p>
          <p className="text-gray-800 leading-relaxed font-secondary">
            {challenge?.rules ||
              "Règles absentes, merci de contacter l'administrateur."}
          </p>
        </div>
      </section>
    </>
  );
});

ChallengeInfoSide.displayName = 'ChallengeInfoSide';
export default ChallengeInfoSide;
