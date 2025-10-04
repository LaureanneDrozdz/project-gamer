import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

type TargetType = 'CHALLENGE' | 'PARTICIPATION';

interface VoteButtonProps {
  targetId: string;
  targetType: TargetType;
  onVoteChange?: (hasVoted: boolean) => void;
}

export const VoteButton = ({
  targetId,
  targetType,
  onVoteChange,
}: VoteButtonProps) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [voteId, setVoteId] = useState<string | undefined>(undefined);
  const { user } = useAuth();
  const label = useMemo(() => {
    if (targetType === 'CHALLENGE') {
      return hasVoted ? 'Retirer le vote' : 'Voter pour ce challenge';
    }
    return hasVoted ? 'Retirer le vote' : 'Voter pour cette participation';
  }, [hasVoted, targetType]);
  useEffect(() => {
    const checkVote = async () => {
      if (!targetId || !user?.id) return;

      try {
        const res = await apiFetch('/vote/check', {
          method: 'POST',
          body: JSON.stringify({
            user_id: user.id,
            target_id: targetId,
            target_type: targetType,
          }),
        });
        setHasVoted(res.hasVoted);
        setVoteId(res.voteId);
      } catch (error) {
        console.error('Erreur lors de la vérification du vote :', error);
      }
    };

    checkVote();
  }, [targetId, user?.id, targetType]);

  const handleVoteToggle = async () => {
    if (!user?.id) {
      alert('Connectez-vous pour voter !');
      return;
    }

    try {
      if (hasVoted && voteId) {
        await apiFetch(`/vote/${voteId}`, { method: 'DELETE' });
        setHasVoted(false);
        setVoteId(undefined);
        onVoteChange?.(false);
      } else {
        const res = await apiFetch('/vote', {
          method: 'POST',
          body: JSON.stringify({
            target_id: targetId,
            target_type: targetType,
            user_id: user.id,
          }),
        });

        setHasVoted(true);
        setVoteId(res.voteId);
        onVoteChange?.(true);
      }
    } catch (error: unknown) {
      console.error(
        "Erreur lors de l'opération de vote :",
        (error as Error).message
      );
    }
  };

  return (
    <button
      onClick={handleVoteToggle}
      className="flex items-center gap-1 text-red-500 hover:text-red-600"
      aria-pressed={hasVoted}
      aria-label={label}
    >
      <FontAwesomeIcon
        icon={faHeart}
        fill={hasVoted ? 'currentColor' : 'none'}
      />
    </button>
  );
};
