'use client';

import CreateChallengeModal from '../createChallengeModal/createChallengeModal';
import Button from '../button/button';

const Hero = () => {
  return (
    <section className="w-full h-[50vh] min-h-[25rem] md:min-h-[35rem] bg-[url(/hero/hero.webp)] bg-no-repeat bg-cover bg-center md:bg-left grid grid-cols-1 md:grid-cols-2 items-center justify-center md:relative md:px-11 lg:px-20">
      <div className="md:col-start-2 items-center justify-center w-[95%] md:w-full md:max-w-[45rem] mx-auto px-11 md:px-3 relative z-5 bg-secondary/25 backdrop-blur-sm py-6 ">
        <h1 className="text-2xl md:text-2xl lg:text-5xl text-center pb-2 text-shadow-lg text-blanc">
          Relevez le défi !
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl lg:py-11 flex justify-center items-center text-center w-full text-blanc">
          Rejoignez la communauté des gamers et prouvez vos compétences
        </p>

        <div className="flex flex-col lg:flex-row font-semibold items-center justify-center gap-4 mt-11">
          <CreateChallengeModal
          />

          <Button
            label="Découvrir les défis"
            className="cta-button"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
