import { ReactNode } from 'react';

export const metadata = {
  title: 'Politique de Confidentialité - GamerChallenges',
  description:
    'Consultez la politique de confidentialité de GamerChallenges. Découvrez les informations sur la collecte, l\'utilisation et la protection de vos données personnelles.',
};

export default function ConfidentialityPolicyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
