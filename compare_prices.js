const fs = require('fs');

try {
  // Leer ambos archivos
  console.log('📁 Leyendo archivos...');
  const realMenu = JSON.parse(fs.readFileSync('./public/data/menu-real-campus.json', 'utf8'));
  console.log(`✅ Archivo real cargado: ${realMenu.length} items`);
  
  const deTranslations = JSON.parse(fs.readFileSync('./src/i18n/locales/de.json', 'utf8'));
  console.log(`✅ Archivo DE cargado`);
  
  // Verificar que tenemos menuData
  if (!deTranslations.menuData) {
    console.log('❌ No se encontró menuData en de.json');
    process.exit(1);
  }
  console.log(`✅ MenuData encontrado: ${deTranslations.menuData.length} items\n`);

  // Extraer solo los items del menuData
  const deMenuItems = deTranslations.menuData;
  console.log('🔍 COMPARANDO PRECIOS - PRODUCTOS 19-54\n');
  console.log('='.repeat(80));

  let errorsFound = 0;
  let totalChecked = 0;

  // Buscar productos 19-54 en ambos archivos
  for (let i = 19; i <= 54; i++) {
    const realItem = realMenu.find(item => item.artikelNr === i);
    const deItem = deMenuItems.find(item => item.artikelNr === i);
    
    if (realItem && deItem) {
      totalChecked++;
      
      // Comparar precios
      const realPreis = realItem.preis;
      const dePreis = deItem.preis;
      
      let hasError = false;
      let errorDetails = [];
      
      // Verificar cada tamaño
      ['24cm', '30cm', '40cm'].forEach(size => {
        if (realPreis[size] && dePreis[size] && realPreis[size] !== dePreis[size]) {
          hasError = true;
          errorDetails.push(`  ${size}: DE="${dePreis[size]}" vs REAL="${realPreis[size]}"`);
        }
      });
      
      if (hasError) {
        errorsFound++;
        console.log(`❌ PRODUCTO ${i} - ${realItem.artikel}:`);
        errorDetails.forEach(detail => console.log(detail));
        console.log('');
      } else {
        console.log(`✅ PRODUCTO ${i} - ${realItem.artikel}: OK`);
      }
    } else {
      console.log(`⚠️  PRODUCTO ${i}: No encontrado en uno de los archivos`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`📊 RESUMEN:`);
  console.log(`   Total productos verificados: ${totalChecked}`);
  console.log(`   Errores encontrados: ${errorsFound}`);
  console.log(`   Productos correctos: ${totalChecked - errorsFound}`);

  if (errorsFound === 0) {
    console.log('\n🎉 ¡TODOS LOS PRECIOS ESTÁN CORRECTOS!');
  } else {
    console.log(`\n⚠️  SE ENCONTRARON ${errorsFound} PRODUCTOS CON ERRORES DE PRECIOS`);
  }

} catch (error) {
  console.error('❌ Error:', error.message);
}
