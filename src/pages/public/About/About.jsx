import React from "react";
import aboutContent  from "../../../config/content";
import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div
      className="w-full h-auto md:h-[28rem] lg:h-[32rem] mx-auto lg:bg-contain bg-no-repeat bg-center my-12 md:my-16 lg:my-20"
      style={{ backgroundImage: `url(${aboutContent.images.bac})` }}
     >
      <div className="flex flex-col items-center justify-center h-full text-center gap-4 p-8">
        <img src={aboutContent.images.flag} className="mx-auto w-auto h-12 md:h-16" alt="Flag" />
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-[0.01em] text-center mx-auto" style={{ fontFamily: 'Calibri' }}>
          <span className="text-[#E5181D]">K</span>{t("about.hero.title").substring(1)}
          <span className="block w-32 md:w-40 lg:w-48 border-b-4 border-[#E5181D] mx-auto"></span>
        </p>
        <p
          className="text-xl md:text-2xl lg:text-3xl font-normal leading-tight text-center"
          style={{ fontFamily: 'Alex Brush' }}
        >
          {t("about.hero.subtitle")}
        </p>
        <div className="flex flex-row items-start gap-0">
          <p className="text-base md:text-lg lg:text-xl font-normal leading-tight text-center text-justify lg:w-[80%] lg:ml-[10%]" style={{ fontFamily: 'Calibri' }}>
            <img src={aboutContent.images.logo} alt="Logo" className="inline h-4 md:h-5 mr-[-0.2rem] relative top-[-0.2rem]" />
            {t("about.hero.description").replace('Komita', 'omita')}
          </p>
        </div>
      </div>
    </div>

    <p className="mb-8 md:mb-12 lg:mb-16 ml-4 md:ml-6 font-normal text-xl md:text-2xl lg:text-3xl leading-tight inline-block border-b-4 border-[#E5181D]" style={{ fontFamily: 'Calibri' }}>
      {t("about.vision.title")}
    </p>
    
    {/* Modified vision section to extend full width */}
    <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] mb-8 md:mb-12 lg:mb-16 bg-[#E5181D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-0">
        <div className="flex flex-col md:flex-row items-center md:h-48 lg:h-64 relative">
          <div className="md:ml-6 px-4 md:px-0 w-1/2">
            <p className="font-normal text-lg md:text-xl lg:text-2xl leading-tight text-white text-center md:text-left " style={{ fontFamily: 'Calibri' }}>
              {t("about.vision.description")}
            </p>
          </div>
          <img src={aboutContent.images.man} alt="Man taking a phone" className="object-cover w-full md:w-64 lg:w-80 h-auto md:h-48 lg:h-64 mt-4 md:mt-0 md:absolute md:right-4 lg:right-8" />
        </div>
      </div>
    </div>

    <p className="mb-8 md:mb-12 lg:mb-16 ml-4 md:ml-6 font-normal text-xl md:text-2xl lg:text-3xl leading-tight inline-block border-b-4 border-[#E5181D]" style={{ fontFamily: 'Calibri' }}>
      {t("about.mission.title")}
    </p>
    
    <div className="px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12 lg:mb-16"> 
      {aboutContent.mission.items.map((item) => (
        <div key={item.id} className="flex flex-row items-start gap-4">
          <img src={aboutContent.images[item.icon]} alt={item.icon} className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" />
          <p 
            className="font-normal text-base md:text-lg lg:text-xl leading-tight text-justify w-full" 
            style={{ fontFamily: 'Calibri' }}
          >
            {t(`about.mission.items.${item.id}.text`).split(' ').map((word, index, array) => {
              // Check if this word or phrase should be bold
              const matchingBold = item.boldWords.find(boldPhrase => 
                boldPhrase.includes(word) && 
                array.slice(index, index + boldPhrase.split(' ').length).join(' ').includes(boldPhrase)
              );
              
              if (matchingBold) {
                // If it's the start of a bold phrase
                if (word === matchingBold.split(' ')[0] && 
                    array.slice(index, index + matchingBold.split(' ').length).join(' ') === matchingBold) {
                  return (
                    <span key={index}>
                      <span className="font-bold">{matchingBold}</span>
                      {' '}
                    </span>
                  );
                } else if (!matchingBold.split(' ').slice(1).includes(word)) {
                  // If it's not part of a multi-word bold phrase that's already been rendered
                  return (
                    <span key={index}>
                      <span className="font-bold">{word}</span>
                      {' '}
                    </span>
                  );
                }
                // Skip words that are part of a multi-word bold phrase that's already been rendered
                return null;
              }
              
              // Regular word
              return <span key={index}>{word} </span>;
            })}
          </p>
        </div>
      ))}
    </div>

    <p className="mb-8 md:mb-12 lg:mb-16 ml-4 md:ml-6 font-normal text-xl md:text-2xl lg:text-3xl leading-tight inline-block border-b-4 border-[#E5181D]" style={{ fontFamily: 'Calibri' }}>
      {t("about.values.title")}
    </p>
         
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 px-4 md:px-8">
      {aboutContent.values.items.map((item) => (
        <div key={item.id} className="p-4 w-full rounded-2xl text-center hover:bg-[#D9D9D982] transition duration-300 ease-in-out">
          <img src={aboutContent.images[item.icon]} className="mb-3 mx-auto h-12 md:h-16" alt={item.title} />
          <p className="mb-3 text-center text-lg md:text-xl lg:text-2xl font-bold leading-tight inline-block border-b-4 border-[#E5181D]" style={{ fontFamily: 'Calibri' }}>
            {t(`about.values.items.${item.id}.title`)}
          </p>
          <p className="text-base md:text-lg leading-tight text-center">
            {t(`about.values.items.${item.id}.description`)}
          </p>
        </div>
      ))}
    </div>
    </div>
  );
}

export default About;
