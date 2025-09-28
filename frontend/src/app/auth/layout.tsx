import AuthHeroSection from '../components/auth/authHeroSection';
import '../globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Inscription / Connexion Gamer Challenges ',
  description:
    'Connectez-vous ou créez un compte pour accéder à Gamer Challenges et relever des défis épiques !',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen flex flex-col bg-primary">
      <div className="bg-white flex-1 flex items-center justify-center p-4 h-full">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row bg-transparent rounded-lg h-full items-stretch lg:min-h-[700px]">
          {/* Left Panel - Form */}
          <main className="w-full lg:w-1/2 bg-white p-6 sm:p-8 border-2 border-primary rounded-lg lg:rounded-r-none lg:rounded-l-lg flex flex-col flex-1">
            {children}
          </main>

          {/* Right Panel - Hero Content */}
          <aside
            className="lg:w-1/2 lg:rounded-r-lg lg:flex lg:items-stretch border-2 border-l-0 border-primary hidden  flex-1"
            role="complementary"
          >
            <AuthHeroSection />
          </aside>
        </div>
      </div>
    </section>
  );
}
