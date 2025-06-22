// Test file to verify exports from menuDataHelpers
import { mapAllergens, mapAdditives, type AllergenInfo, type AdditiveInfo } from '../utils/menuDataHelpers';

console.log('Testing exports from menuDataHelpers...');

// Test mapAllergens
const testAllergens = mapAllergens(['D', 'F']);
console.log('mapAllergens test:', testAllergens);

// Test mapAdditives  
const testAdditives = mapAdditives(['1', '2']);
console.log('mapAdditives test:', testAdditives);

export {}; // Make this a module
