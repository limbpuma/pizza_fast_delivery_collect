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
