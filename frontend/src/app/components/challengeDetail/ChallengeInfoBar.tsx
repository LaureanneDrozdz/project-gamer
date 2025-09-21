import type { Challenge } from '@/types';
import { Heart, Users, Star } from 'lucide-react';
import { VoteButton } from '../button/voteButton';
import ChallengeTags from './ChallengeTags';
import ChallengeRules from './ChallengeRules';

type ChallengeInfoBarProps = {
  challenge: Challenge | null;
  onVoteChange: () => void;
};

const ChallengeInfoBar = ({
  challenge,
  onVoteChange,
}: ChallengeInfoBarProps) => {
  const votesCount = challenge?.votes?.length ?? 0;

  return (
    <section className=" shadow-sm rounded-xl">
      <div className="flex items-center justify-start gap-6 md:gap-8 text-sm mb-8 p-4 bg-primary text-white rounded-lg rounded-br-none rounded-bl-none ">
        <div className="flex items-center gap-1">
          <Star size={16} className="text-yellow-500" />
          <p className="text-white font-secondary">
            {challenge?.difficulty || 'Non précisée'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Users size={16} className="text-secondary" />
          <p className="font-bold font-secondary">
            {challenge?.participations?.length ?? 0} participants
          </p>
        </div>
        <div className="flex items-center gap-1">
          {challenge?.id && (
            <VoteButton
              targetId={challenge.id}
              targetType="CHALLENGE"
              onVoteChange={onVoteChange}
            />
          )}
          <p className="font-bold font-secondary">{votesCount} likes</p>
        </div>
      </div>
      <ChallengeTags challenge={challenge} />

      <ChallengeRules challenge={challenge} />
    </section>
  );
};

export default ChallengeInfoBar;
