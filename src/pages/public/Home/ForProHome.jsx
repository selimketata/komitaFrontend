import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ForProHome() {
    const { t } = useTranslation();
    
    return (
        <div className="bg-[#E5181D] flex xxs:flex-col md:flex-row md:gap-10 md:p-10 lg:px-32 justify-center items-center">
            <div className="xxs:p-5 xs:p-0 xs:py-5 xs:px-10 sm:px-14 xxs:w-[100%] lg:w-[70%] md:p-0">
                <span className="text-white xxs:text-[1.4rem] sm:text-3xl lg:text-4xl font-bold w-[100%]" >
                    {t("home.forProfessionals.title")}
                </span>
                <div className="text-white sm:text-[1rem] lg:text-xl pt-5 w-[100%] text-justify">
                    {t("home.forProfessionals.description")}
                </div>
            </div>
            <div className="w-[30%] flex justify-center">
                <Link to="/signup">
                    <button className="bg-black text-white text-xl sm:text-2xl rounded-xl px-12 py-2 mb-5 font-semibold shadow-xl">
                        {t("home.forProfessionals.signupButton")}
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default ForProHome;
