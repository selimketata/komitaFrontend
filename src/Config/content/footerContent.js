/**
 * Configuration file for Footer content
 * This file centralizes all text content for easier management and localization
 */

export const footerContent = {
  // Taglines
  taglines: {
    first: "Un monde de services",
    second: "Un monde tunisien"
  },
  
  // Pages section
  pages: {
    title: "Pages",
    links: [
      { id: "home", label: "Accueil", path: "/" },
      { id: "about", label: "À propos", path: "/about" },
      { id: "services", label: "Services", path: "/services" }
    ]
  },
  
  // Contact section
  contact: {
    title: "Contact",
    email: "Komita@example.com",
    phone: "+216 22 222 222",
    address: "11 rue de mars, Quebec"
  },
  
  // Newsletter section
  newsletter: {
    title: "Newsletter",
    description: "Restez informé de nos derniers services et actualités !",
    placeholder: "Abonnez-vous à notre newsletter",
    buttonText: "Envoyer"
  },
  
  // Social media section
  social: {
    title: "Nous contacter !",
    platforms: [
      { id: "facebook", icon: "fab fa-facebook-f", url: "#" },
      { id: "linkedin", icon: "fab fa-linkedin-in", url: "#" },
      { id: "youtube", icon: "fab fa-youtube", url: "#" },
      { id: "instagram", icon: "fab fa-instagram", url: "#" }
    ]
  },
  
  // Copyright
  copyright: "© 2024 Komita Tunisie. Tous droits réservés"
};