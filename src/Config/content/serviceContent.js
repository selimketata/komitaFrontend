/**
 * Configuration file for Service page content
 * This file centralizes all text content for easier management and localization
 */

const serviceContent = {
  // Hero section
  hero: {
    title: "Trouvez ce que vous désirez, exactement où vous le désirez!",
    subtitle: "Un monde de services, Un monde tunisien",
    searchSection: {
      whatPlaceholder: "Quoi ? (nom du service, mots-clés...)",
      wherePlaceholder: "Où ? (ville, code postal...)",
      findButton: "Trouver"
    }
  },

  // Main content section
  mainContent: {
    title: "Trouver Le service qu'il vous faut, où que vous soyez !",
    sortBy: "Sort by",
    sortOptions: {
      date: "Date",
      name: "Name"
    },
    noResults: {
      message: "Aucun service trouvé",
      resetButton: "Réinitialiser la recherche"
    }
  },

  // Sidebar
  sidebar: {
    mobileToggle: "Show Filters"
  },

  // Service card
  serviceCard: {
    location: "Non spécifié",
    viewDetails: "Voir les détails",
    contactButton: "Contacter"
  }
};

export default serviceContent;