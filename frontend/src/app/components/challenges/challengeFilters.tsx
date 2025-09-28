'use client';

type ChallengeFiltersProps = {
  filter: 'all' | 'with' | 'without';
  onChange: (newFilter: 'all' | 'with' | 'without') => void;
};

export function ChallengeFilters({ filter, onChange }: ChallengeFiltersProps) {
  return (
    <div className="space-x-2" role="group" aria-label="Filtres des challenges">
      <button
        onClick={() => onChange('all')}
        className={`px-4 py-1 rounded ${
          filter === 'all' ? 'bg-cta text-noir' : 'border'
        }`}
        aria-pressed={filter === 'all'}
        aria-label="Afficher tous les challenges"
        type="button"
      >
        Tous
      </button>
      <button
        onClick={() => onChange('with')}
        className={`px-4 py-1 rounded ${
          filter === 'with' ? 'bg-cta text-noir' : 'border'
        }`}
        aria-pressed={filter === 'with'}
        aria-label="Afficher les challenges avec participations"
        type="button"
      >
        Avec participations
      </button>
      <button
        onClick={() => onChange('without')}
        className={`px-4 py-1 rounded ${
          filter === 'without' ? 'bg-cta text-noir' : 'border'
        }`}
        aria-pressed={filter === 'without'}
        aria-label="Afficher les challenges sans participations"
        type="button"
      >
        Sans participation
      </button>
    </div>
  );
}
