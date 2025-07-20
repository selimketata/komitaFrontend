import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
// Fixing the import path to correctly point to the footerContent file
import { footerContent } from "../../../config/content/index.js";
function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="w-full">
      <div className="relative">
        <img 
          src="/topFooter.png" 
          alt="Background" 
          className="w-full h-[100px] md:h-[100px] lg:h-[100px] object-cover object-center" 
        />
      
        <div className="bg-[#142237] absolute top-[65%] w-full">
          <div className="container mx-auto">
            <ul className="flex flex-col md:flex-row justify-between space-y-10 md:space-y-0 md:space-x-10 px-5 md:px-20 py-10 text-white">
              <div className=""> 
                <li className="flex flex-col space-y-3">
                  <img src="/whitekomita.png" alt={t('navbar.common.logo.alt')} className="w-28 h-auto" />
                </li>
                <div className="mt-3">
                  <span className="font-alexBrush pt-5 text-2xl md:text-3xl">
                    {t("navbar.footer.taglines.first")}
                  </span> <br/>
                  <span className="font-alexBrush text-xl md:text-3xl">
                    {t("navbar.footer.taglines.second")}
                  </span>
                </div>
              </div>
              
              <li>
                <h2 className="text-2xl md:text-3xl underline underline-offset-8 decoration-[#E5181D] font-calibri">
                  {t("navbar.footer.pages.title")}
                </h2>
                <ul className="space-y-3 py-3 pt-10">
                  {footerContent.pages.links.map(link => (
                    <li key={link.id} className="text-lg md:text-xl font-calibri">
                      <Link to={link.path} className="hover:text-red-500 transition-colors">
                        {t(`navbar.footer.pages.${link.id}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              
              <li>
                <h2 className="text-2xl md:text-3xl underline underline-offset-8 decoration-[#E5181D] font-calibri">
                  {t("navbar.footer.contact.title")}
                </h2>
                <ul className="space-y-3 py-3 pt-10">
                  <li className="text-lg md:text-xl font-calibri">{footerContent.contact.email}</li>
                  <li className="text-lg md:text-xl font-calibri">{footerContent.contact.phone}</li>
                  <li className="text-lg md:text-xl font-calibri">{footerContent.contact.address}</li>
                </ul>
              </li>
              
              <li>
                <h2 className="text-2xl md:text-3xl underline font-calibri underline-offset-8 decoration-[#E5181D]">
                  {t("navbar.footer.newsletter.title")}
                </h2>
                <ul className="space-y-5 py-3 pt-10">
                  <li className="text-xl font-calibri">{t("navbar.footer.newsletter.description")}</li>
                  <li className="text-xl">
                    <div className="flex">
                      <input 
                        type="text" 
                        placeholder={t("navbar.footer.newsletter.placeholder")} 
                        className="w-full md:w-[80%] py-2 px-2 outline-none text-[1rem] text-black"
                      />
                      <button className="bg-[#E5181D] px-4 py-2 font-calibri text-white hover:bg-red-700 transition-colors">
                        {t("navbar.footer.newsletter.button")}
                      </button>
                    </div>
                  </li>
                  <li className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-2">
                    <h2 className="text-xl font-bold py-2 font-calibri">{t("navbar.footer.social.title")}</h2> 
                    <ul className="flex flex-row space-x-4">
                      {footerContent.social.platforms.map(platform => (
                        <li key={platform.id}>
                          <a href={platform.url} className="block">
                            <div className="bg-white hover:bg-[#E5181D] transition-colors duration-300 rounded-full w-8 h-8 flex items-center justify-center">
                              <i className={`${platform.icon} text-[#142237]`}></i>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-[#142237] text-white text-center py-4 font-calibri">
        {t("navbar.footer.copyright")}
      </div>
    </footer>
  );
}

export default Footer;