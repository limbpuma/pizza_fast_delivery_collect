# 🧪 TEST BRANCH - TARIFF CALCULATION VERIFICATION

## Branch: `lim1712/test-tariff-calculation`

Esta rama contiene la nueva configuración de tarifas para verificar los cálculos de costes de entrega.

## 📋 NUEVA CONFIGURACIÓN DE TARIFAS

### Zone 1 - Campus Area (FREE) 🆓
- **PLZ**: `44149`
- **Mindestbestellwert**: €12.00
- **Lieferkosten**: €0.00 (GRATIS)
- **Kostenlos ab**: €0.00 (Siempre gratis)

### Zone 2A - Close Areas
- **PLZ**: `44225`, `44227`
- **Mindestbestellwert**: €12.00
- **Lieferkosten**: €1.00
- **Kostenlos ab**: €50.00

### Zone 2B - Mid Areas
- **PLZ**: `44369`, `44379`
- **Mindestbestellwert**: €15.00
- **Lieferkosten**: €1.00
- **Kostenlos ab**: €50.00

### Zone 3A - Extended Areas
- **PLZ**: `44135`, `44139`, `44388`, `44147`, `44137`
- **Mindestbestellwert**: €19.99
- **Lieferkosten**: €1.50
- **Kostenlos ab**: €50.00

### Zone 3B - Far Areas
- **PLZ**: `44143`, `44141`, `44145`, `44229`
- **Mindestbestellwert**: €30.00
- **Lieferkosten**: €2.00
- **Kostenlos ab**: €60.00

### Zone 4 - Outer Areas
- **PLZ**: `44359`, `44357`, `44265`, `44263`
- **Mindestbestellwert**: €30.00
- **Lieferkosten**: €2.00
- **Kostenlos ab**: €60.00

### Pickup (Abholung)
- **PLZ**: `abholung`
- **Mindestbestellwert**: €0.00
- **Lieferkosten**: €0.00 (GRATIS)
- **Kostenlos ab**: €0.00

## 🧪 CASOS DE TEST VERIFICADOS

### Test Case 1: Campus Area
```
PLZ: 44149, Pedido: €15.00
✅ Zone: Campus Area (FREE)
✅ Mindestbestellwert: €12.00
✅ Cumple mínimo: SÍ (€15.00 ≥ €12.00)
✅ Coste entrega: €0.00 (GRATIS)
✅ Entrega gratuita: SÍ (siempre gratis)
```

### Test Case 2: Close Areas - Con coste
```
PLZ: 44225, Pedido: €25.00
✅ Zone: Close Areas
✅ Mindestbestellwert: €12.00
✅ Cumple mínimo: SÍ (€25.00 ≥ €12.00)
✅ Coste entrega: €1.00
❌ Entrega gratuita: NO (€25.00 < €50.00)
```

### Test Case 3: Close Areas - Entrega gratuita
```
PLZ: 44225, Pedido: €55.00
✅ Zone: Close Areas
✅ Mindestbestellwert: €12.00
✅ Cumple mínimo: SÍ (€55.00 ≥ €12.00)
✅ Coste entrega: €0.00 (GRATIS por superar €50.00)
✅ Entrega gratuita: SÍ (€55.00 ≥ €50.00)
```

### Test Case 4: Extended Areas - No cumple mínimo
```
PLZ: 44135, Pedido: €15.00
✅ Zone: Extended Areas
✅ Mindestbestellwert: €19.99
❌ Cumple mínimo: NO (€15.00 < €19.99)
⚠️  Coste entrega: €1.50 (si cumpliera el mínimo)
❌ Falta para mínimo: €4.99
```

### Test Case 5: Far Areas - Con coste alto
```
PLZ: 44143, Pedido: €35.00
✅ Zone: Far Areas
✅ Mindestbestellwert: €30.00
✅ Cumple mínimo: SÍ (€35.00 ≥ €30.00)
✅ Coste entrega: €2.00
❌ Entrega gratuita: NO (€35.00 < €60.00)
```

### Test Case 6: Outer Areas - Entrega gratuita
```
PLZ: 44359, Pedido: €70.00
✅ Zone: Outer Areas
✅ Mindestbestellwert: €30.00
✅ Cumple mínimo: SÍ (€70.00 ≥ €30.00)
✅ Coste entrega: €0.00 (GRATIS por superar €60.00)
✅ Entrega gratuita: SÍ (€70.00 ≥ €60.00)
```

### Test Case 7: Pickup
```
PLZ: abholung, Pedido: €5.00
✅ Zone: Pickup
✅ Mindestbestellwert: €0.00
✅ Cumple mínimo: SÍ (sin mínimo para recogida)
✅ Coste entrega: €0.00 (GRATIS - recogida)
✅ Entrega gratuita: SÍ (siempre gratis)
```

## ⚡ LÓGICA DE CÁLCULO

### Algoritmo de Cálculo:
1. **Buscar tarifa por PLZ** → Encontrar configuración de zona
2. **Verificar mínimo** → `pedido ≥ mindestbestellwert`
3. **Calcular coste entrega**:
   - Si `pedido ≥ lieferkosten_entfallen_ab` → €0.00 (GRATIS)
   - Si `pedido < lieferkosten_entfallen_ab` → `lieferkosten`
4. **Validar pedido** → Solo permitir checkout si cumple mínimo

### Casos Especiales:
- **Campus (44149)**: Siempre gratis, independiente del monto
- **Pickup (abholung)**: Sin mínimo, siempre gratis
- **Zonas lejanas**: Mínimo alto (€30) y entrega gratuita solo a partir de €60

## 🚀 ESTADO DE IMPLEMENTACIÓN

### ✅ Completado:
- [x] Configuración de tarifas en `deliveryTariffs.ts`
- [x] Actualización de interfaces TypeScript
- [x] Funciones de cálculo implementadas
- [x] Build exitoso
- [x] Casos de test documentados

### 🔄 Para Verificar en UI:
- [ ] Pantalla de carrito muestra costes correctos
- [ ] Validación de mínimo funciona
- [ ] Progreso hacia entrega gratuita se muestra
- [ ] Checkout se deshabilita cuando no se cumple mínimo

## 📱 PRÓXIMOS PASOS

1. **Verificar en desarrollo**: `npm run dev`
2. **Probar diferentes PLZ** en la interfaz
3. **Verificar cálculos** con pedidos de diferentes montos
4. **Validar UI/UX** de alertas y validaciones
5. **Confirmar comportamiento** antes de merge

---

**Rama creada**: June 25, 2025  
**Estado**: ✅ Lista para testing  
**Build**: ✅ Exitoso  
**Configuración**: ✅ Implementada
