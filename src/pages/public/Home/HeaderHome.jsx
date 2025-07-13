import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { homeContent } from "../../../config/content";
import khosma from "/khomsa.png";

function HeaderHome() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const navigate = useNavigate(); // Initialize useNavigate hook
  
  // Add state for search inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  // Use the service categories from the configuration
  const listeServices = useMemo(() => homeContent.serviceCategories, []);

  const servicesPerPage = 8;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentServices, setCurrentServices] = useState([]);
  const [currentService, setCurrentService] = useState("");

  // Helper function to get the translated metier based on current language
  const getTranslatedMetier = useCallback((metierObj) => {
    if (!metierObj) return "";
    return metierObj[currentLang] || metierObj.en || "";
  }, [currentLang]);

  // Fix the initialization issue
  useEffect(() => {
    setCurrentServices(listeServices.slice(0, servicesPerPage));
    setCurrentService(getTranslatedMetier(listeServices[0]?.metier));
  }, [listeServices, getTranslatedMetier]);

  // Update services when language changes
  useEffect(() => {
    setCurrentIndex(0);
    setCurrentServices(listeServices.slice(0, servicesPerPage));
    setCurrentService(getTranslatedMetier(listeServices[0]?.metier));
  }, [t, listeServices, getTranslatedMetier, currentLang]);

  // Update current services when index changes
  useEffect(() => {
    if (currentIndex % servicesPerPage === 0) {
      const startIdx = currentIndex % listeServices.length;
      const endIdx = Math.min(startIdx + servicesPerPage, listeServices.length);
      setCurrentServices(listeServices.slice(startIdx, endIdx));
    }
    
    const serviceIndex = currentIndex % listeServices.length;
    setCurrentService(getTranslatedMetier(listeServices[serviceIndex]?.metier));
  }, [currentIndex, listeServices, servicesPerPage, getTranslatedMetier]);

  // Rotation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex < listeServices.length ? nextIndex : 0;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [listeServices.length]);

  // Handle search and navigation to Service page
  const handleSearch = () => {
    // Build query parameters only for non-empty fields
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.append('query', searchQuery.trim());
    }
    
    if (locationQuery.trim()) {
      params.append('location', locationQuery.trim());
    }
    
    // Navigate to the Service page with search parameters
    navigate(`/service?${params.toString()}`);
  };

  // Memoized IMG component for better performance
  const IMG = useCallback(({ item, isSelected, onClick }) => {
    const translatedMetier = getTranslatedMetier(item.metier);
    
    return (
      <div
        className={`flex justify-center items-center transition-all duration-300 ${
          isSelected ? "transform scale-105" : ""
        }`}
      >
        <img
          src={item.image}
          alt={translatedMetier}
          className={`xxs:p-1.5 sm:p-2 border-2 border-solid md:shadow-md rounded-xl 
            xxs:w-[50px] xs:w-[55px] sm:w-[55px] md:w-[55px] lg:w-[60px] 
            ${isSelected
              ? "bg-[#E8E8E8] border-[#142237bc]"
              : "bg-white border-[#14223752]"
            }`}
          onClick={() => onClick && onClick(translatedMetier)}
        />
      </div>
    );
  }, [getTranslatedMetier]);

  return (
    <div>
      {/* Section avec image de fond */}
      <div
        className="flex xxs:flex-col md:flex-row gap-[3%] xxs:px-0 md:px-0 xl:px-28 w-full"
        style={{
          backgroundImage: `url(${khosma})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Texte et services */}
        <div className="xxs:w-[100%] md:w-[60%] p-5 flex flex-col md:gap-10 md:mt-24 xxs:justify-center xxs:items-center sm:justify-start">
          <div className="xxs:text-[1.6rem] xxs:h-28 md:text-4xl min-h-[80px] flex flex-col items-center text-center">
            <div>
              {t("home.header.title.prefix")}{" "}
              <strong className="text-red">
                {currentService}
              </strong>{" "}
              {t("home.header.title.suffix")}
            </div>
          </div>
          
          {/* Replacing the grid with a flex row layout */}
          <div className="flex flex-row flex-wrap justify-center gap-3 sm:gap-4 w-full max-w-[600px] mx-auto">
            {currentServices.map((item, index) => (
              <div className="flex justify-center" key={index}>
                <IMG
                  item={item}
                  onClick={() => {}}
                  isSelected={index === currentIndex % servicesPerPage}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Image de droite */}
        <div className="xxs:w-[100%] md:w-[30%] xxs:mt-5 md:mt-20 flex xxs:justify-center md:justify-end items-end">
          <img
            src="/Tunisia.png"
            alt="Tunisia"
            className="xxs:w-[250px] xs:w-[300px] md:w-[100%]"
          />
        </div>
      </div>

      {/* Section Recherche */}
      <div className="bg-red w-full md:h-40">
        <div className="flex xxs:flex-col xxs:gap-5 xxs:py-8 md:flex-row justify-center items-center h-full md:py-14">
          <div className="flex xxs:flex-col xxs:gap-2 md:flex-row w-full justify-center items-center md:w-[50%]">
            <input
              type="text"
              placeholder={t("home.header.searchSection.whatPlaceholder")}
              className="xxs:w-[80%] xxs:h-[35px] p-3 md:w-[100%] md:h-[45px] rounded-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <input
              type="text"
              placeholder={t("home.header.searchSection.wherePlaceholder")}
              className="xxs:w-[80%] xxs:h-[35px] p-3 md:w-[100%] md:h-[45px] rounded-2xl"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            className="bg-black font-semibold text-xl text-white px-16 py-2 rounded-xl"
            onClick={handleSearch}
          >
            {t("home.header.searchSection.findButton")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeaderHome;
