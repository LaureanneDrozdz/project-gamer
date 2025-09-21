import Button from '../button/button';

function AuthButtons() {
  return (
    <>
      <Button label="Connexion" href="/auth/signin" variant="cta" />
      <Button label="Inscription" href="/auth/signup" variant="white" />
    </>
  );
}
export default AuthButtons;
