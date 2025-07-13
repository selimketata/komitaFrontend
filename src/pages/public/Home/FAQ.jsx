import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Get FAQ questions from translations
  const faqQuestions = t("home.faq.questions", { returnObjects: true });

  return (
    <div className="mb-10">
      <div className="xs:mx-5 xxs:mt-5 lg:mt-10 sm:mx-10 lg:mx-20">
        {/* title */}
        <div className="flex flex-col md:space-y-5">
          <span className="xxs:px-6 xxs:text-[1.6rem] sm:text-3xl md:px-10 font-semibold lg:text-3xl underline underline-offset-8" style={{ textDecorationColor: '#DC2626' }}>
            {t("home.faq.title")}
          </span>
          <span className="xxs:px-6 xxs:mt-4 md:px-10 my-15 sm:text-[1rem] lg:text-xl font-medium">
            {t("home.faq.subtitle")}
          </span>
        </div>

        <img src="/image 255.png" alt="FAQ" className="xxs:w-[90%] xxs:ml-[5%] sm:w-[60%] sm:ml-[20%] md:ml-[15%] md:w-[70%] lg:ml-[25%] lg:w-[50%] mt-5" />

        <div className="flex items-center justify-center md:px-10 mt-5 px-5 lg:mx-24">
          <div className="bg-white w-full">
            {faqQuestions.map((faq, index) => (
              <div key={index} className="border-b border-gray-200">
                <button
                  className="flex justify-between items-center w-full p-4 text-left"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 transition-transform ${
                      openIndex === index ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <div className="p-4 text-gray-600">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
