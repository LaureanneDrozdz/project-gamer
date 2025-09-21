import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

type TargetType = 'CHALLENGE' | 'PARTICIPATION';

interface VoteButtonProps {
  targetId: string;
  targetType: TargetType;
  onVoteChange?: () => void;
}

export const VoteButton = ({
  targetId,
  targetType,
  onVoteChange,
}: VoteButtonProps) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [voteId, setVoteId] = useState<string | undefined>(undefined);
  const { user } = useAuth();

  useEffect(() => {
    if (!targetId || !user?.id) return;

    // Vérifier si l'utilisateur a déjà voté
    apiFetch('/vote/check', {
      method: 'POST',
      body: JSON.stringify({
        user_id: user.id,
        target_id: targetId,
        target_type: targetType,
      }),
    })
      .then((res) => {
        setHasVoted(res.hasVoted);
        setVoteId(res.voteId);
      })
      .catch((error) => {
        console.error('Erreur lors de la vérification du vote :', error);
      });
  }, [targetId, user?.id, hasVoted, voteId]);

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
      }

      // Appeler onVoteChange après la mise à jour réussie
      onVoteChange?.();
    } catch (error: any) {
      console.error("Erreur lors de l'opération de vote :", error.message);
    }
  };

  return (
    <button
      onClick={handleVoteToggle}
      className="flex items-center gap-1 text-red-500 hover:text-red-600"
    >
      <Heart size={18} fill={hasVoted ? 'currentColor' : 'none'} />
    </button>
  );
};
