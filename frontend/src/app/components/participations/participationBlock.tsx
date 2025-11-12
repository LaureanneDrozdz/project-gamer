'use client';
import { useEffect, useState } from 'react';
import LoginForm from '../auth/Form/loginForm';
import ParticipationForm from './ParticipationForm';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export default function ParticipationBlock({
  challengeId,
}: {
  challengeId: string;
}) {
  const { user, isLoggedIn, login } = useAuth();
  const [submitError, setSubmitError] = useState('');
  const [isParticipationSubmitted, setIsParticipationSubmitted] =
    useState(false);
  const [hasUserParticipated, setHasUserParticipated] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const checkParticipation = async () => {
      if (!user?.id || !challengeId) {
        setHasUserParticipated(false);
        return;
      }
      try {
        const res = await apiFetch(`/participation/check`, {
          method: 'POST',
          body: JSON.stringify({
            challenge_id: challengeId,
            user_id: user.id,
          }),
        });
        setHasUserParticipated(res.hasParticipated);
      } catch {
        setHasUserParticipated(false);
      }
    };
    checkParticipation();
  }, [user?.id, challengeId]);

  async function handleLoginSubmit(email: string, password: string) {
    setLoginError('');
    try {
      await login({ email, password });
    } catch (err: unknown) {
      setLoginError((err as Error).message);
    }
  }

  const handleParticipationSubmit = async (
    videoUrl: string,
    description: string
  ): Promise<boolean> => {
    setSubmitError('');
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
      setIsParticipationSubmitted(true);
      return true;
    } catch (err: unknown) {
      setSubmitError((err as Error).message || 'Erreur lors de la soumission');
      return false;
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4 font-primary">
        Participez au Challenge
      </h2>
      {isParticipationSubmitted ? (
        <div
          className="bg-secondary border-l-4 border-primary text-primary p-3 rounded-lg shadow-md flex items-center gap-4"
          role="alert"
        >
          <FontAwesomeIcon icon={faCircleCheck} className="text-primary" />
          <div>
            <p className="font-bold text-primary">
              Participation enregistrée !
            </p>
            <p>Votre participation a bien été soumise.</p>
          </div>
        </div>
      ) : hasUserParticipated ? (
        <div
          className="bg-secondary border-l-4 border-primary text-primary p-3 rounded-lg shadow-md flex items-center gap-4"
          role="alert"
        >
          <FontAwesomeIcon icon={faCircleInfo} className="text-primary" />
          <div>
            <p className="font-bold text-primary">
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
  );
}
