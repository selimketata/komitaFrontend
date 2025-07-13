import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function AboutInHome() {
    const { t } = useTranslation();
    
    return (
        <div className="flex xxs:flex-col w-[100%] mt-5 md:flex-row md:mb-5 md:px-5 lg:my-10 lg:px-16">
            <div className="flex flex-col xxs:px-6 xs:px-10 sm:px-14 md:w-[70%]">
                <span className="xxs:text-[1.6rem] sm:text-3xl font-semibold lg:text-3xl underline underline-offset-8" style={{ textDecorationColor: '#DC2626' }}>
                    {t("home.aboutSection.title")}
                </span>
                <span className="xxs:mt-4 my-15 sm:text-[1rem] lg:text-xl font-medium">
                    {t("home.aboutSection.subtitle")}
                </span>
                <div className="py-2 text-[1rem] text-justify">
                    {t("home.aboutSection.description")}
                </div>
                <Link to="/about" className="xxs:text-[1.2rem] sm:text-[1rem] lg:text-xl font-medium text-[#E5181D]">
                    {t("home.aboutSection.readMore")}
                </Link>
            </div>
            <div className="flex justify-center items-center md:w-[30%]">
                <img src="/Group 246.png" className="my-5 xxs:w-[150px] xxs:ml-0 md:w-[150px] md:h-[150px] lg:w-[50%] lg:h-auto" alt="About Komita" />
            </div>
        </div>
    );
}

export default AboutInHome;
