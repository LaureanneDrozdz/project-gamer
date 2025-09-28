import Image from 'next/image';

export default function AuthHeroSection() {
  return (
    <div className="relative text-blanc">
      <div className="absolute inset-0 bg-center bg-no-repeat">
        <Image
          src="/images/bg-hero-auth.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          fetchPriority="high"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(74,32,64,0.62)] to-transparent" aria-hidden="true"></div>
      <div className="relative z-10 my-auto flex flex-col py-8 px-8">
        <h1 className="text-3xl font-bold mb-4 z-10">LEVEL UP TON GAME !</h1>
        <p className="font-medium mb-8">
          AFFRONTE DES JOUEURS PASSIONNÉS SUR DES CHALLENGES ÉPIQUES ET DEVIENS
          LE MEILLEUR DU CLASSEMENT
        </p>
        <div className="space-y-6 z-10">
          <div className="flex items-center">
            <div className="bg-cta rounded-full p-2 w-10 h-10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="ml-4 font-bold">+ DE 50 000 JOUEURS</span>
          </div>

          <div className="flex items-center">
            <div className="bg-cta rounded-full p-2 w-10 h-10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <span className="ml-4 font-bold">+ DE 1 000 DÉFIS</span>
          </div>

          <div className="flex items-center">
            <div className="bg-cta rounded-full p-2 w-10 h-10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                />
              </svg>
            </div>
            <span className="ml-4 font-bold">+ DE 200 JEUX</span>
          </div>
        </div>
      </div>
    </div>
  );
}
