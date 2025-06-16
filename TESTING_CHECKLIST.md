# 🍕 **TESTING CHECKLIST - LIEFERANDO STYLE**

## ✅ **FUNCIONALIDADES A PROBAR**

### **📱 Cards Compactas:**
- [ ] **Layout compacto**: Imagen + info esencial en una línea
- [ ] **Información limitada**: Solo nombre, categoría, ingredientes (2 líneas max)
- [ ] **Precio "desde"**: Muestra precio base con indicador "ab/from"
- [ ] **Badges dinámicos**: Popular, picante, categoría visible
- [ ] **Hover effects**: Sombra y border color al pasar el mouse

### **🔍 Modal de Detalles ("Item Info"):**
- [ ] **Apertura suave**: Transición scale + slide + fade
- [ ] **Información completa**: Imagen grande, descripción, ingredientes completos
- [ ] **Info nutricional**: Expandible con valores per 100g y per pizza
- [ ] **Especificaciones**: Peso, diámetro, calorías visibles
- [ ] **Alérgenos**: Iconos y advertencias claras
- [ ] **Botón "Add"**: Cierra modal de detalles y abre modal de tamaños

### **📏 Modal de Tamaños (botón "+"):**
- [ ] **3 tamaños disponibles**: Klein (26cm), Normal (32cm), Groß (40cm)
- [ ] **Cálculo dinámico**: Precios se actualizan según multiplicador
- [ ] **Peso calculado**: Basado en área (diámetro²) 
- [ ] **Precio/100g**: Se recalcula automáticamente
- [ ] **Selección visual**: Radio buttons con feedback visual
- [ ] **Resumen final**: Muestra pizza + tamaño + precio final
- [ ] **Loading animation**: Al hacer "Add to basket"
- [ ] **Integración carrito**: Se agrega correctamente con tamaño especificado

### **🎨 Animaciones y Transiciones:**
- [ ] **Modal backdrop**: Fade in/out (200ms)
- [ ] **Modal content**: Scale + slide (300ms)
- [ ] **Cards hover**: Shadow transition (200ms)
- [ ] **Button states**: Color transitions fluidas
- [ ] **Loading spinner**: En botón "adding..."

### **📱 Responsive Design:**
- [ ] **Mobile (≤640px)**: Cards en columna, modales ocupan viewport
- [ ] **Tablet (641-1023px)**: Layout optimizado para touch
- [ ] **Desktop (≥1024px)**: Hover states, mejor spacing

### **🌐 Localización:**
- [ ] **Alemán (DE)**: "Artikel Info", "Größe wählen", "In den Warenkorb"
- [ ] **Inglés (EN)**: "Item Info", "Select Size", "Add to basket"
- [ ] **Cambio de idioma**: Traducciones en modales se actualizan

### **♿ Accesibilidad:**
- [ ] **Escape key**: Cierra modales
- [ ] **Focus management**: Trap focus dentro del modal
- [ ] **ARIA labels**: Screen reader friendly
- [ ] **Keyboard navigation**: Tab order lógico

---

## 🔍 **CASOS DE PRUEBA ESPECÍFICOS**

### **Test 1: Flujo Completo de Compra**
1. Abrir `/menu`
2. Click en "Item Info" de cualquier pizza
3. Verificar información completa en modal
4. Click en botón "Add" del modal de detalles
5. Seleccionar tamaño "Groß (40cm)"
6. Verificar precio actualizado
7. Click "In den Warenkorb"
8. Verificar loading animation
9. Verificar que se agregó al carrito con tamaño correcto

### **Test 2: Comparación de Tamaños**
1. Click en "+" de una pizza base €12.50
2. Verificar Klein: ~€10.00, ~212g, precio/100g calculado
3. Verificar Normal: €12.50, 320g, precio/100g base
4. Verificar Groß: ~€17.50, ~500g, precio/100g calculado
5. Seleccionar cada tamaño y verificar resumen

### **Test 3: Mobile Experience**
1. Cambiar viewport a 375px (iPhone)
2. Verificar cards compactas legibles
3. Abrir modal de detalles - debe ocupar mayoría del viewport
4. Abrir modal de tamaños - verificar touch targets ≥44px
5. Verificar scroll behavior con modales abiertos

### **Test 4: Cambio de Idioma**
1. Cambiar a alemán
2. Verificar "Artikel Info" en cards
3. Abrir modal de tamaños
4. Verificar "Größe wählen", "Verfügbare Größen"
5. Cambiar a inglés y verificar traducciones

---

## 🎯 **CRITERIOS DE ÉXITO**

### **✅ Criterios Obligatorios:**
- Modales se abren/cierran sin errores
- Cálculos de precio/peso son correctos matemáticamente
- No hay memory leaks o re-renders excesivos
- Responsive funciona en mobile/tablet/desktop
- Traducciones EN/DE funcionan correctamente
- Accessibility: Escape, focus trap, ARIA labels

### **🎨 Criterios de Calidad:**
- Animaciones suaves (60fps)
- Transiciones naturales y profesionales
- Loading states apropiados
- Error handling graceful
- Performance óptimo (<100ms interactions)

---

## 🐛 **POSIBLES ISSUES A VERIFICAR**

### **⚠️ Areas de Riesgo:**
- **Modal z-index**: Verificar que modales aparezcan sobre todo contenido
- **Portal rendering**: Verificar que modales se renderizan fuera del DOM principal
- **Body scroll**: Verificar que scroll background se desactive con modal abierto
- **Event propagation**: Click en backdrop debe cerrar modal
- **Cálculos matemáticos**: Verificar redondeo de precios y pesos
- **State management**: Verificar que estado del carrito se actualiza correctamente

### **🔧 Debugging Tips:**
```javascript
// Verificar cálculos en consola:
const basePrice = 12.50;
const multipliers = [0.8, 1.0, 1.4];
multipliers.forEach(m => console.log(`€${(basePrice * m).toFixed(2)}`));

// Verificar peso por área:
const baseWeight = 320;
const diameters = [26, 32, 40];
diameters.forEach(d => {
  const weight = Math.round(baseWeight * Math.pow(d / 32, 2));
  console.log(`${d}cm: ${weight}g`);
});
```

---

**Status**: ⏳ **READY FOR TESTING**  
**Aplicación**: 🚀 http://localhost:5174/menu  
**Documentación**: 📝 LIEFERANDO_STYLE_COMPLETED.md
