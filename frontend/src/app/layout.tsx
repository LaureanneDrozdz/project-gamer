import './globals.css';
import type { ReactNode } from 'react';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import { AuthProvider } from '@/lib/auth-context';
import { Raleway, Roboto, Pacifico } from "./font";

export const metadata = {
  title: 'ACCUEIL - GamerChallenges',
  description:
    'Participez à des défis entre gamers, rejoignez des tournois en ligne et prouvez vos skills sur GamerChallenges, la plateforme dédiée aux joueurs passionnés.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className={`min-h-screen flex flex-col ${Raleway.variable} ${Roboto.variable} ${Pacifico.variable}`}>
        <AuthProvider>
          <Header />
          <main className="">{children}</main>
          <div id="modal-root" />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
