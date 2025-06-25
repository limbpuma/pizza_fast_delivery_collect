/**
 * 🔍 SCRIPT DE VERIFICACIÓN: Mindestbestellwert Correcciones
 * 
 * Script manual para verificar que las correcciones funcionan correctamente
 * Ejecutar: node -r ts-node/register src/utils/verify-mindestbestellwert.ts
 */

import { getTariffByPLZ, calculateDeliveryFee } from './deliveryTariffs';

console.log('🧪 VERIFICACIÓN DE CORRECCIONES DE MINDESTBESTELLWERT\n');

// Test Zone 1 (Campus)
console.log('📍 ZONE 1 (CAMPUS) - Esperado: €12.00 mindestbestellwert');
const zone1PLZ = ['44149', '44147', '44137'];
zone1PLZ.forEach(plz => {
  const tariff = getTariffByPLZ(plz);
  console.log(`  PLZ ${plz}: €${tariff?.mindestbestellwert} | Zona: ${tariff?.id}`);
});

// Test Zone 2 (City) 
console.log('\n📍 ZONE 2 (CITY) - Esperado: €15.00 mindestbestellwert');
const zone2PLZ = ['44135', '44139', '44388', '44145', '44143', '44141', '44229', '44225', '44227', '44369', '44379'];
zone2PLZ.forEach(plz => {
  const tariff = getTariffByPLZ(plz);
  console.log(`  PLZ ${plz}: €${tariff?.mindestbestellwert} | Zona: ${tariff?.id}`);
});

// Test Zone 3 (Outer)
console.log('\n📍 ZONE 3 (OUTER) - Esperado: €20.00 mindestbestellwert');
const zone3PLZ = ['44357', '44359', '44265', '44263'];
zone3PLZ.forEach(plz => {
  const tariff = getTariffByPLZ(plz);
  console.log(`  PLZ ${plz}: €${tariff?.mindestbestellwert} | Zona: ${tariff?.id}`);
});

// Test Pickup
console.log('\n📍 PICKUP - Esperado: €10.00 mindestbestellwert');
const pickupTariff = getTariffByPLZ('abholung');
console.log(`  Pickup: €${pickupTariff?.mindestbestellwert} | Zona: ${pickupTariff?.id}`);

// Test cálculos de delivery
console.log('\n💰 VERIFICACIÓN DE CÁLCULOS DE DELIVERY');

console.log('\n🧮 Zone 1 (44149) - Pedido €10 (bajo mínimo)');
const test1 = calculateDeliveryFee('44149', 10.00);
console.log(`  Cumple mínimo: ${test1.meetsMinimum} | Falta: €${test1.missingAmount} | Fee: €${test1.fee}`);

console.log('\n🧮 Zone 1 (44149) - Pedido €15 (sobre mínimo)');
const test2 = calculateDeliveryFee('44149', 15.00);
console.log(`  Cumple mínimo: ${test2.meetsMinimum} | Falta: €${test2.missingAmount} | Fee: €${test2.fee}`);

console.log('\n🧮 Zone 2 (44135) - Pedido €12 (bajo mínimo)');
const test3 = calculateDeliveryFee('44135', 12.00);
console.log(`  Cumple mínimo: ${test3.meetsMinimum} | Falta: €${test3.missingAmount} | Fee: €${test3.fee}`);

console.log('\n🧮 Zone 2 (44135) - Pedido €20 (sobre mínimo)');
const test4 = calculateDeliveryFee('44135', 20.00);
console.log(`  Cumple mínimo: ${test4.meetsMinimum} | Falta: €${test4.missingAmount} | Fee: €${test4.fee}`);

console.log('\n🧮 Zone 2 (44135) - Pedido €45 (delivery gratis)');
const test5 = calculateDeliveryFee('44135', 45.00);
console.log(`  Cumple mínimo: ${test5.meetsMinimum} | Falta: €${test5.missingAmount} | Fee: €${test5.fee}`);

console.log('\n✅ VERIFICACIÓN COMPLETADA');
