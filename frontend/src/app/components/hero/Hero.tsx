'use client';

import CreateChallengeModal from '../createChallengeModal/createChallengeModal';
import Button from '../button/button';
import Image from 'next/image';

const Hero = () => {
  return (
    <section
      className="relative w-full h-[50vh] min-h-[25rem] md:min-h-[35rem] flex items-center justify-center md:relative md:px-11 lg:px-20"
      role="banner"
    >
      <Image
        src="/hero/hero.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        fetchPriority="high"
        className="absolute inset-0 object-cover object-center md:object-left z-0"
        sizes="100vw"
      />
      {/* Dark overlay so the foreground text pops */}
      <div className="absolute inset-0 bg-black/65 z-0 pointer-events-none" aria-hidden="true" />
      <div className="items-center justify-center w-full md:max-w-[45rem] mx-auto px-11 md:px-3 relative z-20 py-6 text-center ">
        <h1 className="text-4xl lg:text-6xl text-center pb-2 text-shadow-lg text-blanc font-semibold">
          Relevez le défi !
        </h1>
        <h2 className="text-2xl  lg:text-4xl lg:py-11 text-center w-full text-blanc font-semibold ">
          Rejoignez la communauté des gamers et prouvez vos compétences
        </h2>

        <div className="flex flex-col lg:flex-row font-semibold items-center justify-center gap-6 mt-11">
          <CreateChallengeModal />

          <Button label="Voir les challenges" className="cta-base cta-button" href='/challenges'></Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
