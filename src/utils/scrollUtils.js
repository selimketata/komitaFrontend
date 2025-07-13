/**
 * Utility function to scroll to the top of the page
 * @param {Object} options - Scrolling options
 * @param {string} options.behavior - Scrolling behavior ('auto' or 'smooth')
 * @param {number} options.top - Y-coordinate to scroll to (default: 0)
 */
export const scrollToTop = (options = {}) => {
  const { behavior = 'smooth', top = 0 } = options;
  
  window.scrollTo({
    top,
    behavior
  });
};