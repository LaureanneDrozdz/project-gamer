export default function ParticipationBlock({}) {
  return (
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
  );
}
