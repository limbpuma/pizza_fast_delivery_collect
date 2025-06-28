# 🔧 FIX: TRADUCCIONES FALTANTES - MODAL MULTIPRODUCTOS
**Rama:** lim1712/fix-modal-multiproduct-translations  
**Fecha:** 28 de Junio, 2025  
**Objetivo:** Agregar todas las traducciones faltantes en el modal de configuración de pizzas  

## 🚨 TRADUCCIONES FALTANTES IDENTIFICADAS

### A. Traducciones de Control de Cantidad
- `menu.maxQuantity` - "Max. {{max}}" / "Máx. {{max}}"
- `menu.quantity` - "Anzahl" / "Quantity"

### B. Traducciones de Ingredientes  
- `menu.addMoreIngredients` - "Weitere Zutaten hinzufügen" / "Add More Ingredients"
- `menu.extraIngredients` - "Extra Zutaten" / "Extra Ingredients"
- `menu.selectedIngredients` - "{{count}} ausgewählt" / "{{count}} selected"
- `menu.showAllIngredients` - "Alle Zutaten anzeigen" / "Show All Ingredients"
- `menu.allIngredients` - "Alle Zutaten" / "All Ingredients"
- `menu.selected` - "ausgewählt" / "selected"
- `menu.searchIngredients` - "Zutaten suchen..." / "Search ingredients..."
- `menu.noSearchResults` - "Keine Ergebnisse für '{{term}}'" / "No results for '{{term}}'"
- `menu.searchResultsCount` - "{{count}} Ergebnisse für '{{term}}'" / "{{count}} results for '{{term}}'"
- `menu.noIngredientsFound` - "Keine Zutaten gefunden" / "No ingredients found"
- `menu.showLess` - "Weniger anzeigen" / "Show Less"
- `menu.expandAll` - "Alle öffnen" / "Expand All"
- `menu.collapseAll` - "Alle schließen" / "Collapse All"
- `menu.categoriesCount` - "Kategorien" / "Categories"
- `menu.items` - "Artikel" / "Items"

### C. Traducciones de Categorías de Ingredientes
- `menu.ingredientCategories.fleisch` - "Fleisch" / "Meat"
- `menu.ingredientCategories.käse` - "Käse" / "Cheese"  
- `menu.ingredientCategories.gemüse` - "Gemüse" / "Vegetables"
- `menu.ingredientCategories.meeresfrüchte` - "Meeresfrüchte" / "Seafood"
- `menu.ingredientCategories.gewürze` - "Gewürze" / "Spices"
- `menu.ingredientCategories.premium` - "Premium" / "Premium"

### D. Traducciones de Salsas
- `menu.selectSauce` - "Sauce auswählen" / "Select Sauce"
- `menu.default` - "Standard" / "Default"
- `menu.premium` - "Premium" / "Premium"
- `menu.free` - "Kostenlos" / "Free"
- `menu.sauceRequired` - "Bitte wählen Sie eine Sauce aus." / "Please select a sauce."

### E. Traducciones de Tamaños
- `menu.selectSize` - "Größe auswählen" / "Select Size"

### F. Traducciones Generales del Modal
- `menu.configurePizza` - "Pizza konfigurieren" / "Configure Pizza"
- `menu.total` - "Gesamt" / "Total"
- `menu.adding` - "Hinzufügen..." / "Adding..."
- `menu.addToBasket` - "In den Warenkorb" / "Add to Cart"
- `menu.vegan` - "Vegan" / "Vegan"
- `menu.vegetarian` - "Vegetarisch" / "Vegetarian"

## 📝 PLAN DE IMPLEMENTACIÓN

### 1. Actualizar de.json
Agregar todas las traducciones alemanas faltantes en la sección `menu`

### 2. Actualizar en.json  
Agregar todas las traducciones inglesas correspondientes

### 3. Verificar Componentes
Asegurar que todos los componentes usen las claves de traducción correctas

### 4. Testing
Probar el modal en ambos idiomas para verificar que todas las traducciones funcionen

## ✅ CRITERIOS DE ÉXITO
- ✅ Todos los textos del modal traducidos en DE/EN
- ✅ No más textos hardcodeados o con fallbacks
- ✅ Modal funciona perfectamente en ambos idiomas
- ✅ Cambio de idioma en tiempo real funciona

**Estado:** 📋 IDENTIFICADO - Listo para implementar las traducciones
