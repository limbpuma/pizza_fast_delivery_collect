// German market specific helper functions for Campus Pizza Express

// Format currency for German market (€ symbol, comma as decimal separator)
export function formatGermanCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

// German phone number validation (+49 format)
export function isValidGermanPhone(phone: string): boolean {
  // Remove all spaces, hyphens, and parentheses
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  
  // German phone number patterns:
  // +49 followed by area code and number
  // 0 followed by area code and number (domestic format)
  const germanPhoneRegex = /^(\+49|0)[1-9]\d{1,14}$/;
  
  return germanPhoneRegex.test(cleanPhone);
}

// German postal code validation (5 digits)
export function isValidGermanPostalCode(postalCode: string): boolean {
  const germanPostalRegex = /^\d{5}$/;
  return germanPostalRegex.test(postalCode.trim());
}

// Format German address (Street, PLZ City format)
export function formatGermanAddress(street: string, postalCode: string, city: string): string {
  return `${street}, ${postalCode} ${city}`;
}

// German date formatting (DD.MM.YYYY HH:MM)
export function formatGermanDate(dateStr: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

// Calculate estimated delivery time in German format
export function calcGermanDeliveryTime(estimatedDelivery: string): string {
  const now = new Date().getTime();
  const deliveryTime = new Date(estimatedDelivery).getTime();
  const difference = deliveryTime - now;
  const minutes = Math.ceil(difference / 60000);

  if (minutes <= 0) {
    return "Bestellung sollte bereits angekommen sein";
  }
  
  if (minutes === 1) {
    return "Noch 1 Minute";
  }
  
  return `Noch ${minutes} Minuten`;
}

// German number formatting
export function formatGermanNumber(value: number): string {
  return new Intl.NumberFormat('de-DE').format(value);
}

// Pluralization helper for German
export function getGermanPlural(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

// International phone number validation
export function isValidInternationalPhone(phone: string): boolean {
  // Remove all spaces, hyphens, and parentheses
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  
  // Phone validation patterns by country code
  const phonePatterns: { [key: string]: RegExp } = {
    '+49': /^\+49[1-9]\d{1,14}$/, // Germany
    '+34': /^\+34[6-9]\d{8}$/, // Spain
    '+33': /^\+33[1-9]\d{8}$/, // France
    '+39': /^\+39[0-9]\d{6,11}$/, // Italy
    '+31': /^\+31[6]\d{8}$/, // Netherlands
    '+32': /^\+32[0-9]\d{7,8}$/, // Belgium
    '+43': /^\+43[0-9]\d{6,13}$/, // Austria
    '+41': /^\+41[0-9]\d{8}$/, // Switzerland
    '+44': /^\+44[0-9]\d{9,10}$/, // United Kingdom
    '+1': /^\+1[0-9]\d{9}$/, // United States/Canada
  };

  // Find matching country code
  for (const [countryCode, pattern] of Object.entries(phonePatterns)) {
    if (cleanPhone.startsWith(countryCode)) {
      return pattern.test(cleanPhone);
    }
  }
  
  // If no specific pattern found, use basic international format
  const basicInternationalRegex = /^\+[1-9]\d{1,14}$/;
  return basicInternationalRegex.test(cleanPhone);
}

// Get expected phone format by country code
export function getPhoneFormatExample(countryCode: string): string {
  const examples: { [key: string]: string } = {
    '+49': '123 456 7890 (Germany)',
    '+34': '123 456 789 (Spain)',
    '+33': '1 23 45 67 89 (France)',
    '+39': '123 456 7890 (Italy)',
    '+31': '6 12345678 (Netherlands)',
    '+32': '12 34 56 78 (Belgium)',
    '+43': '123 456789 (Austria)',
    '+41': '12 345 67 89 (Switzerland)',
    '+44': '7123 456789 (UK)',
    '+1': '(123) 456-7890 (US/Canada)',
  };
  
  return examples[countryCode] || 'xxx xxx xxxx';
}
