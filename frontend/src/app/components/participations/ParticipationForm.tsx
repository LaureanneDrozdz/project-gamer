import React, { useState } from 'react';

type ParticipationFormProps = {
  onSubmit: (videoUrl: string, description: string) => Promise<boolean>;
  submitError: string;
};

const ParticipationForm = ({
  onSubmit,
  submitError,
}: ParticipationFormProps) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(videoUrl, description);
    if (success) {
      setVideoUrl('');
      setDescription('');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="video-url"
            className="block text-sm font-medium text-gray-700 mb-1 font-secondary"
          >
            Lien de votre vidéo (YouTube, Twitch, etc.)
          </label>
          <input
            type="url"
            id="video-url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary font-secondary"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
        <div>
          <label
            htmlFor="participation-description"
            className="block text-sm font-medium text-gray-700 mb-1 font-secondary"
          >
            Description de votre participation
          </label>
          <textarea
            id="participation-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary font-secondary"
            placeholder="Ajoutez une description à votre participation"
          ></textarea>
        </div>
        {submitError && <p className="text-red-500">{submitError}</p>}
        <button
          type="submit"
          className="w-full mt-6 py-3 rounded-full text-primary font-bold text-lg tracking-wide bg-cta hover:bg-cta/75 transition-colors font-primary"
        >
          PARTICIPER
        </button>
      </form>
    </div>
  );
};

export default ParticipationForm;
