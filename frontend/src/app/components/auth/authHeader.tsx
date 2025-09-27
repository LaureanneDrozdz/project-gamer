import { useRouter } from 'next/navigation';

type AuthHeaderProps = {
  active: 'signin' | 'signup';
  title: string;
};

export default function AuthHeader({ active, title }: AuthHeaderProps) {
  const router = useRouter();

  return (
    <>
      <div className="mb-6 flex">
        <button
          onClick={() => router.push('/auth/signin')}
          className={`px-4 py-2 rounded font-medium ${active === 'signin' ? 'bg-primary text-blanc' : 'bg-white text-noir'}`}
        >
          CONNEXION
        </button>
        <button
          onClick={() => router.push('/auth/signup')}
          className={`px-4 py-2 ml-2 rounded font-medium ${active === 'signup' ? 'bg-primary text-blanc' : 'bg-white text-noir'}`}
        >
          INSCRIPTION
        </button>
      </div>
      <div className="flex items-center mb-8">
        <div className="bg-primary rounded-full p-2 w-10 h-10 flex items-center justify-center text-blanc font-bold">
          GC
        </div>
        <span className="ml-2 text-dark font-medium">GamerChallenges</span>
      </div>
      <h2 className="text-xl font-bold mb-8">{title}</h2>
    </>
  );
}
