export const parseStreetAddress = (street) => {
  if (!street) return { streetNumber: '', streetName: '', streetType: '' };
  
  // Match patterns like "SDFGHJ 12 Boulevard"
  const parts = street.split(' ');
  let streetNumber = '';
  let streetType = '';
  let streetName = '';

  // Find the number in the string
  const numberIndex = parts.findIndex(part => /\d+/.test(part));
  if (numberIndex !== -1) {
    streetNumber = parts[numberIndex];
    streetName = parts.slice(0, numberIndex).join(' ');
    streetType = parts.slice(numberIndex + 1).join(' ');
  } else {
    // If no number found, assume last word is street type
    streetType = parts[parts.length - 1];
    streetName = parts.slice(0, -1).join(' ');
  }

  return { 
    streetNumber: parseInt(streetNumber) || 0,
    streetName: streetName || '',
    streetType: streetType || ''
  };
};

export const formatAddress = (userAddress) => {
  if (!userAddress || typeof userAddress !== 'object') return '';

  const street = userAddress.street || '';
  const { streetNumber, streetName, streetType } = parseStreetAddress(street);

  const addressParts = [
    [streetName, streetNumber, streetType].filter(Boolean).join(' '),
    userAddress.city,
    userAddress.provinceName || userAddress.state, // Support both provinceName and state
    userAddress.postalCode || userAddress.zipCode, // Support both postalCode and zipCode
    userAddress.country
  ].filter(part => part && part.trim() !== '');

  return addressParts.join(', ');
};