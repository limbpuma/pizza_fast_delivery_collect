// Debug script para verificar la estructura de datos del menú
const fs = require('fs');

try {
  console.log('🔍 ANÁLISIS DE DATOS DEL MENÚ\n');
  
  const deTranslations = JSON.parse(fs.readFileSync('./src/i18n/locales/de.json', 'utf8'));
  const menuItems = deTranslations.menuData;
  
  console.log(`✅ Total items en menuData: ${menuItems.length}`);
  
  // Analizar los primeros productos pizza (19-25)
  const pizzaProducts = menuItems.filter(item => item.artikelNr >= 19 && item.artikelNr <= 25);
  
  console.log('\n📊 ESTRUCTURA DE PRODUCTOS PIZZA:');
  console.log('='.repeat(50));
  
  pizzaProducts.forEach(item => {
    console.log(`\nPRODUCTO ${item.artikelNr} - ${item.artikel}:`);
    console.log(`  Categoría: ${item.kategorie}`);
    console.log(`  Precio estructura:`, typeof item.preis);
    
    if (typeof item.preis === 'object') {
      console.log(`  Precios:`);
      Object.entries(item.preis).forEach(([size, price]) => {
        console.log(`    ${size}: ${price}`);
      });
    } else {
      console.log(`  Precio único: ${item.preis}`);
    }
  });
  
  // Verificar qué pasa con el menuLoader
  console.log('\n🔧 SIMULANDO MENULOADER...');
  console.log('='.repeat(50));
  
  // Simular el procesamiento del primer producto pizza
  const testItem = pizzaProducts[0];
  const isMultiSize = typeof testItem.preis === 'object';
  
  console.log(`\nPROCESANDO: ${testItem.artikel}`);
  console.log(`  Es multi-size: ${isMultiSize}`);
  
  if (isMultiSize) {
    const pricesObj = testItem.preis;
    const parsedPrices = Object.entries(pricesObj).map(([size, price]) => {
      const cleanPrice = price.replace('€', '').replace(',', '.').trim();
      const numPrice = parseFloat(cleanPrice);
      console.log(`    ${size}: "${price}" -> ${numPrice}`);
      return numPrice;
    });
    
    const unitPrice = Math.min(...parsedPrices);
    console.log(`  unitPrice calculado: ${unitPrice}`);
    console.log(`  sizes objeto creado: ${JSON.stringify(pricesObj)}`);
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
