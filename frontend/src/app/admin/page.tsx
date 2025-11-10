'use client';
import { apiFetch } from '@/lib/api';
import { useEffect, useState } from 'react';

type User = { id: string; userName?: string; email?: string };
type Challenge = { id: string; title?: string; description?: string; validated?: boolean };
type Participation = { id: string; description?: string; video_url?: string };

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchAdminData() {
    setLoading(true);
    try {
      const [challengesData, participationsData, usersData] = await Promise.all([
        apiFetch('/challenge', { next: { revalidate: 60 } }),
        apiFetch('/participation', { next: { revalidate: 60 } }),
        apiFetch('/user', { next: { revalidate: 60 } })
      ]);


      setUsers(Array.isArray(usersData) ? usersData : []);
      setChallenges(Array.isArray(challengesData) ? challengesData : []);
      setParticipations(Array.isArray(participationsData) ? participationsData : []);
    } catch {
      setError(`Failed to load admin data`);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdminData();

  }, []);


 

  async function deleteUser(id: string) {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await apiFetch(`/user/${id}`, {
        method: 'DELETE',
      });
      await fetchAdminData();
      alert('Utilisateur supprimé');
    } catch {
      alert('Échec suppression utilisateur');
    }
  }

  async function deleteChallenge(id: string) {
    if (!confirm('Supprimer ce challenge ?')) return;
    try {
      await apiFetch(`/challenge/${id}`, {
        method: 'DELETE',
      });
      await fetchAdminData();
      alert('Challenge supprimé');
    } catch(error) {
      alert('Échec suppression challenge');
    }
  }

  async function deleteParticipation(id: string) {
    if (!confirm('Supprimer cette participation ?')) return;
    try {
      await apiFetch(`/participation/${id}`, {
        method: 'DELETE',
      });
      await fetchAdminData();
      alert('Participation supprimée');
    } catch(error) {
      alert('Échec suppression participation');
    }
  }

  async function toggleValidated(challenge: Challenge) {
    const id = challenge.id;
    const newVal = !Boolean(challenge.validated);
    try {
      await apiFetch(`/challenge/validate/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ validated: newVal }),
      });
      await fetchAdminData();
      alert(`Challenge ${newVal ? 'validé' : 'dévalidé'}`);
    } catch {
      alert('Échec mise à jour challenge');
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          <section>
            <h2 className="text-xl mb-2">Users ({users.length})</h2>
            <ul className="space-y-2">
              {users.map((u) => (
                <li key={u.id} className="p-2 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-medium">{u.userName || u.email || u.id}</div>
                    <div className="text-sm text-muted-foreground">{u.email}</div>
                  </div>
                  <div>
                    <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => deleteUser(u.id)}>
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl mb-2">Challenges ({challenges.length})</h2>
            <ul className="space-y-2">
              {challenges.map((c) => (
                <li key={c.id} className="p-2 border rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{c.title || c.id}</div>
                      <div className="text-sm text-muted-foreground">{c.description}</div>
                      <div className="text-sm">Validé: {c.validated ? 'oui' : 'non'}</div>
                    </div>
                    <div className="space-x-2">
                      <button className="px-2 py-1 bg-amber-500 text-black rounded" onClick={() => toggleValidated(c)}>
                        {c.validated ? 'Dévalider' : 'Valider'}
                      </button>
                      <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => deleteChallenge(c.id)}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl mb-2">Participations ({participations.length})</h2>
            <ul className="space-y-2">
              {participations.map((p) => (
                <li key={p.id} className="p-2 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-medium">{p.description || p.video_url || p.id}</div>
                  </div>
                  <div>
                    <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => deleteParticipation(p.id)}>
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
