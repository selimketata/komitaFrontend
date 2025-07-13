/**
 * Configuration file for About page content
 * This file centralizes all text content for easier management and localization
 */

// Image imports moved outside the object
import man from "/man taking a phone.png";
import feuille1 from "/11.png";
import feuille2 from "/22.png";
import feuille3 from "/33.png";
import feuille4 from "/44.png";
import c1 from "/1.png";
import c2 from "/2.png";
import c3 from "/3.png";
import c4 from "/4.png";
import c5 from "/5.png";
import c6 from "/6.png";
import bac from "/backg komita.png";
import flag from "/Capture 1.png";
import logo from "/komita.png";

export const aboutContent = {
  // Images and icons object to export all image references
  images: {
    man,
    feuille1,
    feuille2,
    feuille3,
    feuille4,
    c1,
    c2,
    c3,
    c4,
    c5,
    c6,
    bac,
    flag,
    logo
  },
  
  hero: {
    title: "Komita",
    subtitle: "Un monde de services Un monde tunisien",
    description: "Komita est le concept qui connecte la diaspora tunisienne au Canada avec des professionnels tunisiens qualifiés. En quelques clics, accédez à des services de qualité offerts par des experts tunisiens, tout en renforçant les liens entre le Canada et la Tunisie à travers un réseau dynamique et innovant."
  },
  
  vision: {
    title: "Notre vision",
    description: "Devenir la principale destination en ligne pour les Tunisiens à l'étranger à la recherche de services professionnels de qualité, tout en renforçant les liens au sein de la communauté tunisienne à l'échelle mondiale."
  },
  
  mission: {
    title: "Notre mission",
    items: [
      {
        id: 1,
        icon: "feuille1",
        text: "Offrir une plateforme qui connecte les professionnels tunisiens à leur diaspora, en rendant les services fiables et accessibles.",
        boldWords: ["professionnels tunisiens", "fiables", "accessibles"]
      },
      {
        id: 2,
        icon: "feuille2",
        text: "Offrir de l'accessibilité pour les Tunisiens résidant à l'étranger vers les services de leur compatriotes professionnels.",
        boldWords: ["l'accessibilité", "services", "compatriotes"]
      },
      {
        id: 3,
        icon: "feuille3",
        text: "Centraliser les informations des professionnels Tunisiens dans une seule plateforme.",
        boldWords: ["informations des professionnels"]
      },
      {
        id: 4,
        icon: "feuille4",
        text: "Offrir de la visibilité pour les professionnels Tunisiens à l'étranger envers la Communauté Tunisienne.",
        boldWords: ["visibilité"]
      }
    ]
  },
  
  values: {
    title: "Nos valeurs",
    items: [
      {
        id: 1,
        icon: "c1",
        title: "Communauté",
        description: "Renforcer les liens de la diaspora tunisienne."
      },
      {
        id: 2,
        icon: "c2",
        title: "Qualité",
        description: "Une expérience fluide, sûre et de grande qualité."
      },
      {
        id: 3,
        icon: "c3",
        title: "Connectivité",
        description: "Connecter les Tunisiens du monde entier en un clic."
      },
      {
        id: 4,
        icon: "c4",
        title: "Intégrité",
        description: "Transparence et respect dans toutes nos actions."
      },
      {
        id: 5,
        icon: "c5",
        title: "Accessibilité",
        description: "Accessible à tous, partout, sans limites techniques."
      },
      {
        id: 6,
        icon: "c6",
        title: "Innovation",
        description: "Innover pour satisfaire les besoins de la communauté."
      }
    ]
  }
};

export default aboutContent;