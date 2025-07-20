/**
 * Configuration file for Service Details page content
 * This file centralizes all text content for easier management and localization
 */

export const serviceDetailsContent = {
  // Navigation
  navigation: {
    backButton: "Retourner",
    backToServices: "Retourner aux services"
  },
  
  // Service information
  serviceInfo: {
    price: "Prix",
    category: "Catégorie",
    location: "Emplacement",
    createdOn: "Créé le",
    verified: "Vérifié",
    notVerified: "Non vérifié",
    addToWishlist: "Ajouter aux favoris",
    removeFromWishlist: "Retirer des favoris",
    wishlistAdded: "Service ajouté à vos favoris",
    wishlistRemoved: "Service retiré de vos favoris",
    contactOwner: "Contacter",
    description: "Description",
    address: "Adresse",
    noDescription: "Aucune description disponible pour ce service."
  },
  
  // Owner information
  ownerInfo: {
    title: "À propos du prestataire",
    contactInfo: "Informations de contact",
    email: "Email",
    phone: "Téléphone",
    address: "Adresse",
    website: "Site web",
    description: "Description",
    viewProfileButton: "Voir profil",
    verifiedProvider: "Prestataire vérifié",
    defaultDescription: "Aucune description disponible pour ce prestataire.",
    defaultAddress: "MONTREAL, QC H2Z 2Y7",
    defaultPhone: "+1 (514) 123-4567",
    defaultEmail: "contact@example.com",
    defaultWebsite: "www.example.com"
  },
  
  // Similar services section
  similarServices: {
    title: "Services similaires",
    viewButton: "Consulter",
    verified: "Vérifié",
    locationNotSpecified: "Emplacement non spécifié",
    noImageAvailable: "Aucune image disponible"
  },
  
  // Service image gallery
  imageGallery: {
    noImagesAvailable: "Aucune image disponible",
    previousImage: "Image précédente",
    nextImage: "Image suivante",
    viewImage: "Voir l'image"
  },
  
  // Contact popup
  contactPopup: {
    title: "Contacter le prestataire",
    nameLabel: "Votre nom",
    emailLabel: "Votre email",
    messageLabel: "Votre message",
    sendButton: "Envoyer",
    cancelButton: "Annuler",
    successMessage: "Message envoyé avec succès",
    errorMessage: "Erreur lors de l'envoi du message"
  },
  
  // Service not found
  serviceNotFound: {
    title: "Service non trouvé",
    message: "Nous n'avons pas pu trouver le service que vous recherchez. Il a peut-être été supprimé ou déplacé.",
    viewAllServices: "Voir tous les services",
    backButton: "Retour"
  },
  
  // Loading and error states
  states: {
    loading: "Chargement...",
    error: "Une erreur est survenue lors du chargement des détails du service",
    serviceNotFound: "Service non trouvé",
    componentError: "Erreur de chargement des composants"
  }
};

