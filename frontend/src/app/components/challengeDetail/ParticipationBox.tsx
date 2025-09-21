import { useAuth } from '@/lib/auth-context';
import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import ParticipationForm from './ParticipationForm';
import LoginForm from './LoginForm';

type ParticipationBoxProps = {
  challengeId: string;
};

const ParticipationBox = ({ challengeId }: ParticipationBoxProps) => {
  const { isLoggedIn, login, user } = useAuth();
  const [submitError, setSubmitError] = useState('');
  const [loginError, setLoginError] = useState('');

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
      return true;
    } catch (err: any) {
      setSubmitError(err.message || 'Erreur lors de la soumission');
      return false;
    }
  };

  const handleLoginSubmit = async (
    emailOrUsername: string,
    password: string
  ) => {
    setLoginError('');
    try {
      await login({ email: emailOrUsername, password });
    } catch (err: any) {
      setLoginError(
        err.message || 'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-6 font-primary">
        Participez au Challenge
      </h3>
      {isLoggedIn ? (
        <ParticipationForm
          onSubmit={handleParticipationSubmit}
          submitError={submitError}
        />
      ) : (
        <LoginForm onLogin={handleLoginSubmit} loginError={loginError} />
      )}
    </div>
  );
};

export default ParticipationBox;
