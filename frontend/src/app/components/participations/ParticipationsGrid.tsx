import type { Challenge } from '@/types';
import ParticipationCard from '@/app/components/participations/participationCard';

type ParticipationsGridProps = {
  challenge: Challenge | null;
};

const ParticipationsGrid = ({ challenge }: ParticipationsGridProps) => {
  return (
    <section
      className="md:col-span-1"
      aria-label="Liste des participations au challenge"
    >
      <h2 className="text-xl font-bold mb-6 font-primary">Participations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenge?.participations && challenge.participations.length > 0 ? (
          challenge.participations.map((participation) => (
            <ParticipationCard
              key={participation.id}
              link={participation.video_url}
              title={participation.description}
              nbVotes={participation.nb_votes}
              participationId={participation.id}
            />
          ))
        ) : (
          <p className="text-gray-600" role="status">
            Aucune participation pour ce challenge.
          </p>
        )}
      </div>
    </section>
  );
};

export default ParticipationsGrid;
