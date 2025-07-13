/**
 * Configuration file for Navbar content
 * This file centralizes all text content for easier management and localization
 */

export const navbarContent = {
  // Common navbar elements
  common: {
    logo: {
      alt: "Komita Logo"
    },
    languageSelector: {
      label: "Langue",
      options: {
        fr: "Français",
        en: "English",
      }
    }
  },
  
  // Before login navbar
  beforeLogin: {
    links: [
      { id: "home", path: "/", label: "Home" },
      { id: "about", path: "/about", label: "About" },
      { id: "services", path: "/service", label: "Services" }
    ],
    buttons: {
      login: "Se connecter",
      signup: "S'inscrire"
    }
  },
  
  // After login navbar
  afterLogin: {
    links: [
      { id: "home", path: "/", label: "Home" },
      { id: "about", path: "/about", label: "About" },
      { id: "services", path: "/service", label: "Services" }
    ],
    profileMenu: {
      items: [
        { id: "profile", path: "/professional/Profile-management", label: "Profile", roleRequired: "PROFESSIONAL"  },
        { id: "dashboard", path: "/professional/services-management", label: "Dashboard", roleRequired: "PROFESSIONAL" },
        { id: "overview", path: "/admin", label: "Overview", roleRequired: "ADMIN"  },
        { id: "services-management", path: "/admin/services-management", label: "Services Management", roleRequired: "ADMIN"  },
        { id: "users-management", path: "/admin/users-management", label: "Users Management", roleRequired: "ADMIN"  },
        { id: "categories-management", path: "/admin/categories-management", label: "Categories Management", roleRequired: "ADMIN"  },
        { id: "logout", label: "Logout", action: "logout" }
      ],
      upgradeButton: "Devenir professionnel",
      upgradeConfirm: "Êtes-vous sûr de vouloir devenir un professionnel ?",
      upgradeSuccess: "Votre compte a été mis à niveau avec succès !",
      upgradeError: "Échec de la mise à niveau du compte. Veuillez réessayer."
    }
  }
};

export default navbarContent;