// Script simplificado para encontrar diferencias de precios
// Basado en la muestra de precios reales proporcionada

const fs = require('fs');

// Precios reales de referencia (productos 19-54)
const preciosReales = {
  19: { "24cm": "5,00 €", "30cm": "7,00 €", "40cm": "10,00 €" },
  20: { "24cm": "5,30 €", "30cm": "7,50 €", "40cm": "11,50 €" },
  21: { "24cm": "5,30 €", "30cm": "7,50 €", "40cm": "11,50 €" },
  22: { "24cm": "6,20 €", "30cm": "8,00 €", "40cm": "13,00 €" },
  23: { "24cm": "6,00 €", "30cm": "8,00 €", "40cm": "13,00 €" },
  24: { "24cm": "6,00 €", "30cm": "8,40 €", "40cm": "14,50 €" },
  25: { "24cm": "6,50 €", "30cm": "8,40 €", "40cm": "14,50 €" },
  26: { "24cm": "7,00 €", "30cm": "9,00 €", "40cm": "14,50 €" },
  27: { "24cm": "6,80 €", "30cm": "8,80 €", "40cm": "14,50 €" },
  28: { "24cm": "6,80 €", "30cm": "8,80 €", "40cm": "14,50 €" },
  29: { "24cm": "5,90 €", "30cm": "7,90 €", "40cm": "13,00 €" },
  30: { "24cm": "5,90 €", "30cm": "7,90 €", "40cm": "13,00 €" },
  31: { "24cm": "6,40 €", "30cm": "8,40 €", "40cm": "14,00 €" },
  32: { "24cm": "6,40 €", "30cm": "8,40 €", "40cm": "14,00 €" },
  33: { "24cm": "6,40 €", "30cm": "8,40 €", "40cm": "14,00 €" },
  34: { "24cm": "6,60 €", "30cm": "8,60 €", "40cm": "15,50 €" },
  35: { "24cm": "6,90 €", "30cm": "8,90 €", "40cm": "15,50 €" },
  36: { "24cm": "6,60 €", "30cm": "8,60 €", "40cm": "15,50 €" },
  37: { "24cm": "6,60 €", "30cm": "8,60 €", "40cm": "15,50 €" },
  38: { "24cm": "7,20 €", "30cm": "9,20 €", "40cm": "15,50 €" },
  39: { "24cm": "7,30 €", "30cm": "9,30 €", "40cm": "15,50 €" },
  40: { "24cm": "6,80 €", "30cm": "8,80 €", "40cm": "15,50 €" },
  41: { "24cm": "7,40 €", "30cm": "9,40 €", "40cm": "16,00 €" },
  42: { "30cm": "8,90 €" },
  43: { "24cm": "7,40 €", "30cm": "9,40 €", "40cm": "16,00 €" },
  44: { "24cm": "7,40 €", "30cm": "9,40 €", "40cm": "16,00 €" },
  45: { "24cm": "6,60 €", "30cm": "8,60 €", "40cm": "15,50 €" },
  46: { "24cm": "6,90 €", "30cm": "9,90 €", "40cm": "16,00 €" }, // Corregido: era "9,900 €"
  47: { "24cm": "6,50 €", "30cm": "8,90 €", "40cm": "15,50 €" },
  48: { "24cm": "6,90 €", "30cm": "8,90 €", "40cm": "16,00 €" },
  49: { "24cm": "8,90 €" },
  50: { "24cm": "6,80 €", "30cm": "8,90 €", "40cm": "14,50 €" },
  51: { "24cm": "6,80 €", "30cm": "8,90 €", "40cm": "14,50 €" },
  52: { "24cm": "7,20 €", "30cm": "9,20 €", "40cm": "15,00 €" },
  53: { "24cm": "6,80 €", "30cm": "8,90 €", "40cm": "14,50 €" },
  54: { "24cm": "5,90 €", "30cm": "7,90 €", "40cm": "14,00 €" }
};

try {
  console.log('🔍 COMPARANDO PRECIOS REALES VS DE.JSON - PRODUCTOS 19-54\n');
  console.log('='.repeat(80));
  
  const deTranslations = JSON.parse(fs.readFileSync('./src/i18n/locales/de.json', 'utf8'));
  const deMenuItems = deTranslations.menuData;
  
  let errorsFound = 0;
  let totalChecked = 0;
  const erroresDetallados = [];

  // Comparar cada producto
  for (let i = 19; i <= 54; i++) {
    const precioReal = preciosReales[i];
    const deItem = deMenuItems.find(item => item.artikelNr === i);
    
    if (precioReal && deItem) {
      totalChecked++;
      let hasError = false;
      let errorDetails = [];
      
      // Verificar cada tamaño
      ['24cm', '30cm', '40cm'].forEach(size => {
        if (precioReal[size] && deItem.preis[size]) {
          if (precioReal[size] !== deItem.preis[size]) {
            hasError = true;
            errorDetails.push(`  ${size}: DE="${deItem.preis[size]}" vs REAL="${precioReal[size]}"`);
          }
        }
      });
      
      if (hasError) {
        errorsFound++;
        console.log(`❌ PRODUCTO ${i} - ${deItem.artikel}:`);
        errorDetails.forEach(detail => console.log(detail));
        console.log('');
        
        erroresDetallados.push({
          artikelNr: i,
          artikel: deItem.artikel,
          precioReal: precioReal,
          precioActual: deItem.preis
        });
      } else {
        console.log(`✅ PRODUCTO ${i} - ${deItem.artikel}: CORRECTO`);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`📊 RESUMEN:`);
  console.log(`   Total productos verificados: ${totalChecked}`);
  console.log(`   Errores encontrados: ${errorsFound}`);
  console.log(`   Productos correctos: ${totalChecked - errorsFound}`);

  if (erroresDetallados.length > 0) {
    console.log(`\n🔧 PRODUCTOS QUE NECESITAN CORRECCIÓN:`);
    erroresDetallados.forEach(error => {
      console.log(`   ${error.artikelNr} - ${error.artikel}`);
    });
  }

} catch (error) {
  console.error('❌ Error:', error.message);
}
