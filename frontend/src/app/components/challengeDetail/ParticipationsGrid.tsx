import type { Challenge } from '@/types';
import ParticipationCard from '@/app/components/participationCard/participationCard';

type ParticipationsGridProps = {
  challenge: Challenge | null;
};

const ParticipationsGrid = ({ challenge }: ParticipationsGridProps) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6 font-primary">Participations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenge?.participations && challenge.participations.length > 0 ? (
          challenge.participations.map((participation) => (
            <ParticipationCard
              key={participation.id}
              link={participation.video_url}
              title={participation.description}
              nbVotes={participation.nb_votes}
              challenge={null}
              userId={participation.user_id}
              participationId={participation.id}
            />
          ))
        ) : (
          <p>Aucune participation pour ce challenge.</p>
        )}
      </div>
    </div>
  );
};

export default ParticipationsGrid;
