import type { Challenge } from '@/types';

type ChallengeRulesProps = {
  challenge: Challenge | null;
};

const ChallengeRules = ({ challenge }: ChallengeRulesProps) => {
  return (
    <div className="mb-8 p-4">
      <h3 className="text-xl font-bold mb-4 font-primary">
        Description & Règles
      </h3>
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
    </div>
  );
};

export default ChallengeRules;
