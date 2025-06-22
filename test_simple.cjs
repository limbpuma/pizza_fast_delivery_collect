const fs = require('fs');

console.log('🔍 SCRIPT DE COMPARACIÓN INICIADO');

try {
  const deTranslations = JSON.parse(fs.readFileSync('./src/i18n/locales/de.json', 'utf8'));
  console.log('✅ Archivo DE.JSON cargado correctamente');
  console.log('✅ MenuData encontrado:', deTranslations.menuData ? 'SÍ' : 'NO');
  console.log('✅ Cantidad de items:', deTranslations.menuData?.length || 0);
  
  // Buscar producto 22 específicamente
  const producto22 = deTranslations.menuData.find(item => item.artikelNr === 22);
  console.log('\n📊 PRODUCTO 22 EN DE.JSON:');
  console.log('   Nombre:', producto22?.artikel);
  console.log('   Precios:', JSON.stringify(producto22?.preis, null, 2));
  
  // Precios reales del producto 22 (de la muestra)
  const precio22Real = { "24cm": "6,20 €", "30cm": "8,00 €", "40cm": "13,00 €" };
  console.log('\n📊 PRODUCTO 22 PRECIOS REALES:');
  console.log('   Precios:', JSON.stringify(precio22Real, null, 2));
  
  // Comparar
  console.log('\n🔍 COMPARACIÓN:');
  let tieneError = false;
  ['24cm', '30cm', '40cm'].forEach(size => {
    const dePrice = producto22?.preis[size];
    const realPrice = precio22Real[size];
    const igual = dePrice === realPrice;
    console.log(`   ${size}: DE="${dePrice}" vs REAL="${realPrice}" -> ${igual ? '✅' : '❌'}`);
    if (!igual) tieneError = true;
  });
  
  console.log('\n📝 RESULTADO:', tieneError ? '❌ HAY DIFERENCIAS' : '✅ SON IGUALES');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('❌ Stack:', error.stack);
}
