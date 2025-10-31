'use client';
import type { Challenge, Participation } from '@/types';
import ParticipationCard from '@/app/components/participations/participationCard';
import {  useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

type ParticipationsGridProps = {
  challenge: Challenge | null;
};

const ParticipationsGrid = ({ challenge }: ParticipationsGridProps) => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  useEffect(() => {
    if (challenge) {
      apiFetch(`/participation/challenge/${challenge.id}`)
        .then((data) => setParticipations(data))
        .catch((error) => console.error('Error fetching participations:', error));
    }
  }, [challenge]);

  return (
    <section
      className="md:col-span-1"
      aria-label="Liste des participations au challenge"
    >
      <h2 className="text-xl font-bold mb-6 font-primary">Participations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {participations && participations.length > 0 ? (
          participations.map((participation) => (
            <ParticipationCard
              key={participation.id}
              link={participation.video_url}
              title={participation.description}
              nbVotes={participation.votes.length}
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
