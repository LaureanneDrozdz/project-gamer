'use client';
import type { Challenge } from '@/types';

import { VoteButton } from '../button/voteButton';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';

type ChallengeStatsBarProps = {
  challenge: Challenge | null;
};

const ChallengeStatsBar = ({ challenge }: ChallengeStatsBarProps) => {
  const [votesCount, setVotesCount] = useState<number>(
    challenge?.votes?.length ?? 0
  );
  const onVoteChange = (hasVoted: boolean) => {
    setVotesCount((prevCount) => (hasVoted ? prevCount + 1 : prevCount - 1));
  };
  return (
    <section
      className=" shadow-sm rounded-xl"
      aria-label="Statistiques du challenge"
    >
      <div className="flex items-center justify-start gap-6 md:gap-8 text-sm mb-8 p-4 bg-primary text-white rounded-lg rounded-br-none rounded-bl-none ">
        <div className="flex items-center gap-1">
          <FontAwesomeIcon
            icon={faStar}
            aria-hidden="true"
            className="text-yellow-500"
          />
          <p className="text-white font-secondary">
            <span className="sr-only">Difficulté :</span>{' '}
            {challenge?.difficulty || 'Non précisée'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <FontAwesomeIcon
            icon={faUsers}
            aria-hidden="true"
            className="text-secondary"
          />
          <p className="font-bold font-secondary">
            <span className="sr-only">Participants :</span>{' '}
            {challenge?.participations?.length ?? 0} participants
          </p>
        </div>
        <div className="flex items-center gap-1">
          {challenge?.id && (
            <VoteButton
              targetId={challenge.id}
              targetType="CHALLENGE"
              onVoteChange={(hasVoted) => onVoteChange(hasVoted)}
            />
          )}
          <p className="font-bold font-secondary">
            <span className="sr-only">Votes :</span> {votesCount} likes
          </p>
        </div>
      </div>
    </section>
  );
};

export default ChallengeStatsBar;
