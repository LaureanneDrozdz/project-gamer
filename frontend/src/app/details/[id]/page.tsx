'use client';

import { useEffect, useState } from 'react';
import { Users, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import type { Challenge, User } from '@/types';
import ChallengeDetailHeader from '@/app/components/challengeDetail/ChallengeDetailHeader';
import ChallengeInfoBar from '@/app/components/challengeDetail/ChallengeInfoBar';
import ParticipationsGrid from '@/app/components/challengeDetail/ParticipationsGrid';
import ParticipationForm from '@/app/components/challengeDetail/ParticipationForm';
import LoginForm from '@/app/components/auth/Form/loginForm';

export default function ChallengeDetailPage() {
  const params = useParams();
  const challengeId = params.id as string;
  const [submitError, setSubmitError] = useState('');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isParticipationSubmitted, setIsParticipationSubmitted] =
    useState(false);
  const [hasUserParticipated, setHasUserParticipated] = useState(false);

  const { isLoggedIn, login, user } = useAuth();
  const [userObject, setUserObject] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  const fetchChallenge = () => {
    if (!challengeId) return;
    apiFetch(`/challenge/${challengeId}`)
      .then((data) => {
        setChallenge(data);
        if (user && data.participations) {
          const userHasParticipated = data.participations.some(
            (p: any) => p.user_id === user.id
          );
          setHasUserParticipated(userHasParticipated);
        } else {
          setHasUserParticipated(false);
        }
      })
      .catch((err) => {
        console.error('Erreur lors du chargement du challenge :', err);
      });
  };

  const fetchUser = () => {
    apiFetch(`/user/${user?.id}`).then((data) => {
      setUserObject(data);
    });
  };

  useEffect(() => {
    fetchChallenge();
    fetchUser();
  }, [challengeId, user, hasUserParticipated, challenge]);

  const handleLoginSubmit = async (
    emailOrUsername: string,
    password: string
  ) => {
    setLoginError('');
    try {
      await login({ email: emailOrUsername, password });
      console.log('Logged in successfully!');
    } catch (err: any) {
      console.error('Login failed:', err);
      setLoginError(
        err.message || 'Login failed. Please check your credentials.'
      );
    }
  };

  const handleParticipationSubmit = async (
    videoUrl: string,
    description: string
  ): Promise<boolean> => {
    setSubmitError('');
    console.log('Submitting participation:', { videoUrl, description });
    try {
      await apiFetch('/participation', {
        method: 'POST',
        body: JSON.stringify({
          challenge_id: challengeId,
          video_url: videoUrl,
          description: description,
          validated: false,
          user_id: user?.id,
        }),
      });
      console.log('Participation submitted successfully!');
      fetchChallenge();
      setIsParticipationSubmitted(true);
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la soumission de la participation:', err);
      setSubmitError(err.message || 'Erreur lors de la soumission');
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black dark:text-white">
      <section className="relative px-4 py-4 md:px-8 md:py-6">
        <div className="flex justify-center items-center relative w-full h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden bg-radial-[at_50%_50%] from-secondary via-primary to-black shadow-[inset_0_0_400px_rgba(0,0,0,1)]">
          <img
            src={challenge?.image_url || '/details/default_image.webp'}
            alt="Hero background"
            className="w-auto h-[90%] object-fit mx-auto rounded-3xl shadow-[0px_0px_15px_rgba(0,0,0,0.50)] ring-2 ring-secondary shadow-secondary"
          />
          <div className="absolute top-4 left-4 bg-secondary shadow-[0px_0px_15px_rgba(0,0,0,0.1)] ring-2 ring-primary shadow-secondary text-white text-xs px-3 py-1 rounded-full font-semibold font-primary">
            En cours
          </div>
          <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-75 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-primary">
            <Users size={12} /> {challenge?.participations?.length ?? 0} {''}
            participations
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-1">
          <ChallengeDetailHeader challenge={challenge} />

          <ChallengeInfoBar
            challenge={challenge}
            onVoteChange={fetchChallenge}
          />

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-6 font-primary">
              Participez au Challenge
            </h3>
            {isParticipationSubmitted ? (
              <div
                className="bg-secondary border-l-4 border-primary text-primary p-4 rounded-lg shadow-md flex items-center gap-4"
                role="alert"
              >
                <CheckCircle size={24} className="text-primary" />
                <div>
                  <p className="font-bold text-primari">
                    Participation enregistrée !
                  </p>
                  <p>Votre participation a bien été soumise.</p>
                </div>
              </div>
            ) : hasUserParticipated ? (
              <div
                className="bg-secondary border-l-4 border-primary text-primary p-4 rounded-lg shadow-md flex items-center gap-4"
                role="alert"
              >
                <Info size={24} className="text-primary" />
                <div>
                  <p className="font-bold text-primari">
                    Vous avez déjà participé à ce challenge.
                  </p>
                </div>
              </div>
            ) : isLoggedIn ? (
              <ParticipationForm
                onSubmit={handleParticipationSubmit}
                submitError={submitError}
              />
            ) : (
              <LoginForm onLogin={handleLoginSubmit} loginError={loginError} />
            )}
          </div>
          {isLoggedIn &&
            challenge &&
            userObject &&
            (userObject.id === challenge.user_id ||
              userObject.role === 'ADMIN') && (
              <button
                className="w-full mt-6 py-3 rounded-full text-primary font-bold text-lg tracking-wide bg-red-600 hover:bg-red-600/75 transition-colors font-primary"
                onClick={async () => {
                  if (
                    !window.confirm(
                      'Es-tu sûr de vouloir supprimer ce challenge ?'
                    )
                  )
                    return;
                  try {
                    await apiFetch(`/challenge/${challengeId}`, {
                      method: 'DELETE',
                    });
                    alert('Challenge supprimé !');
                    router.push('/challenges');
                  } catch (err) {
                    console.error('Erreur lors de la suppression :', err);
                    alert('Erreur lors de la suppression du challenge');
                  }
                }}
              >
                Supprimer ce challenge
              </button>
            )}
        </div>

        <div className="md:col-span-1">
          <ParticipationsGrid challenge={challenge} />
        </div>
      </div>
    </div>
  );
}
