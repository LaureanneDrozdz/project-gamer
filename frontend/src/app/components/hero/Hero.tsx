'use client';

import CreateChallengeModal from '../createChallengeModal/createChallengeModal';
import Button from '../button/button';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative w-full h-[50vh] min-h-[25rem] md:min-h-[35rem] grid grid-cols-1 md:grid-cols-2 items-center justify-center md:relative md:px-11 lg:px-20">
       <Image
          src="/hero/hero.webp"
          alt="Hero background"
          fill
          priority
          fetchPriority="high"
          className="absolute inset-0 object-cover object-center md:object-left z-0"
          sizes="100vw"
        />
      <div className="md:col-start-2 items-center justify-center w-[95%] md:w-full md:max-w-[45rem] mx-auto px-11 md:px-3 relative z-5 bg-secondary/25 backdrop-blur-sm py-6 ">
        <h1 className="text-2xl md:text-2xl lg:text-5xl text-center pb-2 text-shadow-lg text-blanc">
          Relevez le défi !
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl lg:py-11 flex justify-center items-center text-center w-full text-blanc">
          Rejoignez la communauté des gamers et prouvez vos compétences
        </p>

        <div className="flex flex-col lg:flex-row font-semibold items-center justify-center gap-6 mt-11">
          <CreateChallengeModal />

          <Button label="Voir les challenges" className="cta-base cta-button" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
