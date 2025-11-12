'use client';

type ChallengeFiltersProps = {
  filter: 'all' | 'with' | 'without';
  onChange: (newFilter: 'all' | 'with' | 'without') => void;
};

export function ChallengeFilters({ filter, onChange }: ChallengeFiltersProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 lg:mb-6"
      role="group"
      aria-label="Filtres des challenges" 
    >
      <h2 className="text-xl font-semibold mb-2 sm:mb-0 sm:mr-4">Filtres</h2>

      <button
        onClick={() => onChange('all')}
        className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm text-center ${
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
        className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm text-center ${
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
        className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm text-center ${
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
