import { ReactNode } from 'react';

export const metadata = {
  title: 'Mentions Légales - GamerChallenges',
  description:
    "Consultez les mentions légales de GamerChallenges. Découvrez les informations sur la propriété intellectuelle, les conditions d'utilisation et la politique de confidentialité.",
};

export default function LegalNotesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
