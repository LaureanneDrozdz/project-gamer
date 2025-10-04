'use client';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import { useState } from 'react';

type ParticipationCardProps = {
  participation: {
    id: string;
    description: string;
    video_url: string;
    created_at: string;
    challenge_id: string;
  };
  onDelete?: (id: string) => void;
};

export function ParticipationCard({
  participation,
  onDelete,
}: ParticipationCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!confirm('Voulez-vous vraiment supprimer cette participation ?'))
      return;
    setDeleting(true);
    setError('');
    try {
      await apiFetch(`/participation/${participation.id}`, {
        method: 'DELETE',
      });
      if (onDelete) onDelete(participation.id);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la suppression'
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mb-4" key={participation.id}>
      <Link href={`/details/${participation.challenge_id}`}>
        <div className="bg-background rounded-lg p-4 shadow hover:scale-105 hover:shadow-lg transition-transform">
          <p className="text-noir">{participation.description}</p>
          <a
            href={participation.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-cta font-semibold hover:underline"
          >
            Voir la vidéo
          </a>
          <span className="block mt-2 text-xs text-noir/60">
            Soumis le{' '}
            {new Intl.DateTimeFormat('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(new Date(participation.created_at))}
          </span>
        </div>
      </Link>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={handleDelete}
          className="text-red-600 font-semibold hover:underline disabled:opacity-50"
          disabled={deleting}
          aria-disabled={deleting}
          aria-label="Supprimer la participation"
          aria-describedby={error ? 'error-message' : undefined}
        >
          {deleting ? 'Suppression...' : 'Supprimer la vidéo'}
        </button>
        {error && (
          <span
            id="error-message"
            className="text-red-500 text-sm ml-2"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
