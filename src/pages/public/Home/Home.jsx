import React from "react";
import FAQ from "./FAQ";
import HeaderHome from "./HeaderHome";
import ForProHome from "./ForProHome";
import AboutInHome from "./AboutInHome";
import RecentServices from "./RecentServices";
import PopularServices from "./PopularServices";



function Home() {
  
  
  return(
    <div>
         <HeaderHome />
         <PopularServices />
         <AboutInHome />
         <RecentServices />
         <ForProHome />
         <FAQ />
    </div>
  )
}
export default Home;