/**
 * Configuration file for Home page content
 * This file centralizes all text content for easier management and localization
 */

export const homeContent = {
  // Header section content
  header: {
    title: {
      prefix: "Trouvez les meilleurs",
      suffix: "dans votre région"
    },
    searchSection: {
      whatPlaceholder: "Que recherchez-vous ?",
      wherePlaceholder: "Où ?",
      findButton: "Rechercher"
    }
  },

  // Popular services section
  popularServices: {
    title: "Les services les plus populairesssssss !",
    viewDetailsButton: "Voir les détails",
    emptyMessage: "Aucun service populaire disponible pour le moment."
  },

  // Recent services section
  recentServices: {
    title: "Les services les plus récentssss !",
    viewDetailsButton: "Voir les détails",
    emptyMessage: "Aucun service récent disponible pour le moment."
  },

  // For professionals section
  forProfessionals: {
    title: "Joindre Notre Komita Professionnelle",
    description: "Rejoignez notre communauté de professionnels tunisiens et connectez-vous avec la diaspora. Augmentez votre visibilité et développez votre activité en proposant vos services sur notre plateforme.",
    signupButton: "S'inscrire"
  },

  // Service categories for the header carousel
  serviceCategories: [
    { image: "/lawyer.png", metier: { fr: "Avocats", en: "Lawyers" } },
    { image: "/doctor.png", metier: { fr: "Médecins", en: "Doctors" } },
    { image: "/plumber.png", metier: { fr: "Plombiers", en: "Plumbers" } },
    { image: "/electrician.png", metier: { fr: "Électriciens", en: "Electricians" } },
    { image: "/cleaning.png", metier: { fr: "Nettoyage", en: "Cleaning" } },
    { image: "/house.png", metier: { fr: "Immobilier", en: "Real Estate" } },
    { image: "/resto.png", metier: { fr: "Restaurants", en: "Restaurants" } },
    { image: "/sport.png", metier: { fr: "Salles de sport", en: "Gyms" } },
    { image: "/voyage.png", metier: { fr: "Agences de voyage", en: "Travel Agencies" } },
    { image: "/mec.png", metier: { fr: "Mécaniciens", en: "Mechanics" } },
    { image: "/kindergarden.png", metier: { fr: "Garderies", en: "Kindergartens" } },
    { image: "/events.png", metier: { fr: "Organisateurs d'événements", en: "Event Planners" } }
  ]
};

export default homeContent;