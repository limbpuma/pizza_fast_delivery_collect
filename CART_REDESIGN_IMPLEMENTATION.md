# 🛒 CART REDESIGN IMPLEMENTATION PLAN

**Fecha de inicio:** 17 de Junio, 2025  
**Rama de desarrollo:** `feature/next-development`  
**Estado:** 🟢 Fase 2 Completada - Testing en progreso

---

## 📋 OVERVIEW DEL PROYECTO

### 🎯 **Objetivo Principal**
Rediseñar completamente el sistema de carrito de compras, moviendo de footer a sidebar responsive, implementando sugerencias inteligentes y creando un footer simple para compliance EU.

### 🖼️ **Referencias de Diseño**
- **Mobile:** `basket-component-mobile.jpg` - Sidebar deslizante desde derecha
- **Desktop:** `component-desktop.jpg` - Panel lateral fijo con navegación

### 🔧 **Especificaciones Técnicas**
- **Trigger:** Cart se abre solo cuando se llama explícitamente
- **Persistencia:** Solo con usuario en cache + TTL (24-48h)
- **Pagos:** Cash o Karte en entrega (sin integración)
- **Priority Order:** ❌ Eliminado del nuevo diseño

---

## 🏗️ ARQUITECTURA DE COMPONENTES

### 📁 **Estructura de Archivos**
```
src/features/cart/
├── Cart.tsx                    # ✅ Existente - Componente principal
├── CartSidebar.tsx            # 🆕 Nuevo - Sidebar mobile/desktop
├── CartHeader.tsx             # 🆕 Nuevo - Header con pestañas
├── CartItem.tsx               # 🔄 Mejorado - Item individual optimizado
├── CartSuggestions.tsx        # 🆕 Nuevo - Sistema de recomendaciones
├── CartSummary.tsx            # 🆕 Nuevo - Resumen detallado
├── CartToggle.tsx             # 🆕 Nuevo - Botón flotante
├── CartPersistence.ts         # 🆕 Nuevo - Sistema de cache
└── hooks/
    ├── useCartSuggestions.ts  # 🆕 Hook para lógica de sugerencias
    └── useCartPersistence.ts  # 🆕 Hook para manejo de cache
```

### 🔄 **Estados del Cart**
```typescript
interface CartState {
  // Estados básicos
  isOpen: boolean                    // Cart abierto/cerrado
  deliveryMode: 'delivery' | 'collection' // Modo seleccionado
  
  // Datos del carrito
  items: CartItem[]                  // Items en el carrito
  subtotal: number                   // Subtotal calculado
  deliveryFee: number               // Tarifa de entrega
  serviceFee: number                // Tarifa de servicio
  total: number                     // Total final
  
  // Sugerencias
  suggestions: Product[]             // Productos sugeridos
  forgottenItems: Product[]         // Items "olvidados"
  
  // Tiempos
  estimatedDeliveryTime: string     // Tiempo estimado entrega
  estimatedCollectionTime: string   // Tiempo estimado recogida
  
  // Cache
  cacheExpiry: number               // Timestamp de expiración
  userId?: string                   // ID del usuario (si está logueado)
}
```

---

## 🎨 DISEÑO Y UX

### 📱 **Mobile Design (≤768px)**
- **Layout:** Sidebar full-screen con overlay
- **Animación:** Slide-in desde derecha (transform: translateX)
- **Header:** Sticky con pestañas y botón cerrar
- **Items:** Layout vertical optimizado para touch
- **Controles:** Botones grandes (+/-) fáciles de tocar
- **Scroll:** Vertical suave con momentum

### 🖥️ **Desktop Design (>768px)**
- **Layout:** Panel lateral fijo (400px width)
- **Comportamiento:** Push content o overlay (configurable)
- **Items:** Layout horizontal compacto
- **Hover States:** Efectos visuales optimizados
- **Navigation:** Flechas para carrusel de sugerencias

### 🎭 **Animaciones y Transiciones**
```css
/* Sidebar entrada/salida */
.cart-sidebar-enter {
  transform: translateX(100%);
  opacity: 0;
}
.cart-sidebar-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: all 300ms ease-out;
}

/* Items del carrito */
.cart-item-remove {
  animation: slideOut 250ms ease-in forwards;
}

/* Backdrop */
.cart-backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}
```

---

## 🧠 LÓGICA DE SUGERENCIAS

### 🍕 **Motor de Recomendaciones**
```typescript
interface SuggestionEngine {
  // Reglas basadas en contenido del cart
  pizzaRules: {
    noBeverage: Product[]      // Si no hay bebidas → Coca-Cola, Cerveza
    noSides: Product[]         // Si no hay acompañantes → Pan ajo, Ensalada
    spicyPizza: Product[]      // Pizza picante → Bebidas refrescantes
  }
  
  pastaRules: {
    needsBread: Product[]      // Pasta → Pan de ajo, Focaccia
    needsSalad: Product[]      // Pasta cremosa → Ensalada fresca
  }
  
  valueRules: {
    lowValue: Product[]        // <15€ → Combos, Ofertas familia
    highValue: Product[]       // >30€ → Postre gratis, Café
  }
  
  contextualRules: {
    lunchTime: Product[]       // 11-15h → Menú del día
    dinnerTime: Product[]      // 18-22h → Aperitivos, Vino
    weekend: Product[]         // Fines de semana → Pizzas familia
  }
}
```

### 📊 **Algoritmo de Sugerencias**
1. **Análisis del cart actual:** Categorías, precios, cantidad
2. **Detección de "gaps":** Falta bebida, acompañante, postre
3. **Contexto temporal:** Hora del día, día de la semana
4. **Histórico del usuario:** Preferencias previas (si disponible)
5. **Ranking por relevancia:** Score 0-100 por pertinencia

### 🎯 **Secciones de Sugerencias**
- **"Have you seen..."** - Productos populares/nuevos
- **"Did you forget?"** - Complementos lógicos (bebidas, pan)
- **"Complete your meal"** - Combos o upgrades

---

## 💾 SISTEMA DE PERSISTENCIA

### 🔄 **Estrategia de Cache**
```typescript
interface CartCache {
  version: string               // Versión del schema
  userId?: string              // ID del usuario (opcional)
  sessionId: string            // ID de sesión único
  items: CartItem[]            // Items del carrito
  preferences: {
    deliveryMode: string       // Modo preferido
    lastAddress?: string       // Última dirección
  }
  metadata: {
    createdAt: number          // Timestamp creación
    lastUpdated: number        // Última actualización
    expiresAt: number          // Timestamp expiración
    viewCount: number          // Número de visitas
  }
}
```

### ⏰ **Gestión de TTL (Time To Live)**
- **Con usuario logueado:** 7 días de inactividad
- **Usuario anónimo:** 24 horas de inactividad
- **Actividad:** Cualquier interacción resetea el timer
- **Cleanup:** Auto-limpieza cada vez que se abre la app

### 💿 **Storage Strategy**
```typescript
// localStorage para persistencia
const CART_STORAGE_KEY = 'campus_pizza_cart_v2'

// sessionStorage para datos temporales
const CART_SESSION_KEY = 'campus_pizza_session'

// Backup en IndexedDB para carts grandes (>50 items)
const CART_IDB_KEY = 'campus_pizza_cart_backup'
```

---

## 🦶 FOOTER SIMPLE EU COMPLIANCE

### 📜 **Enlaces Legales Requeridos**
```tsx
<footer className="bg-gray-100 border-t border-gray-200 py-6">
  <div className="max-w-6xl mx-auto px-4">
    {/* Enlaces legales principales */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
        Privacy Policy
      </a>
      <a href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
        Terms & Conditions
      </a>
      <a href="/imprint" className="text-sm text-gray-600 hover:text-gray-900">
        Imprint
      </a>
      <a href="/cookies" className="text-sm text-gray-600 hover:text-gray-900">
        Cookie Settings
      </a>
    </div>
    
    {/* Copyright y info adicional */}
    <div className="text-center text-xs text-gray-500">
      <p>© 2025 Campus Pizza. All rights reserved.</p>
      <p>Delivery service in Dortmund and surrounding areas</p>
    </div>
  </div>
</footer>
```

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### 📦 **Dependencias Nuevas**
```json
{
  "framer-motion": "^10.x",      // Animaciones fluidas
  "react-spring": "^9.x",        // Transiciones avanzadas (alternativa)
  "date-fns": "^2.x"            // Manejo de timestamps/TTL
}
```

### 🎣 **Hooks Personalizados**
```typescript
// Hook principal del carrito
export const useCart = () => {
  const [state, dispatch] = useCartState()
  const suggestions = useCartSuggestions(state.items)
  const persistence = useCartPersistence(state)
  
  return {
    // Estado
    ...state,
    suggestions,
    
    // Acciones
    openCart: () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
    addItem: (item: CartItem) => dispatch({ type: 'ADD_ITEM', item }),
    removeItem: (id: string) => dispatch({ type: 'REMOVE_ITEM', id }),
    updateQuantity: (id: string, quantity: number) => 
      dispatch({ type: 'UPDATE_QUANTITY', id, quantity }),
    setDeliveryMode: (mode: DeliveryMode) => 
      dispatch({ type: 'SET_DELIVERY_MODE', mode }),
    
    // Utilidades
    clearCart: persistence.clearCart,
    restoreCart: persistence.restoreCart,
  }
}
```

### 🌐 **Integración i18n**
```typescript
// Nuevas traducciones requeridas
const cartTranslations = {
  en: {
    cart: {
      title: "Basket",
      delivery: "Delivery",
      collection: "Collection", 
      estimatedTime: "{{minutes}} min",
      subtotal: "Subtotal",
      deliveryFee: "Delivery fee",
      serviceFee: "Service fee",
      total: "Total",
      checkout: "Checkout ({{total}})",
      haveYouSeen: "Have you seen...",
      didYouForget: "Did you forget?",
      addMore: "Add more",
      removeItem: "Remove item"
    }
  },
  de: {
    cart: {
      title: "Warenkorb",
      delivery: "Lieferung", 
      collection: "Abholung",
      estimatedTime: "{{minutes}} Min",
      subtotal: "Zwischensumme",
      deliveryFee: "Liefergebühr",
      serviceFee: "Servicegebühr", 
      total: "Gesamt",
      checkout: "Zur Kasse ({{total}})",
      haveYouSeen: "Haben Sie gesehen...",
      didYouForget: "Haben Sie vergessen?",
      addMore: "Mehr hinzufügen",
      removeItem: "Artikel entfernen"
    }
  }
}
```

---

## ✅ PLAN DE DESARROLLO

### 🚀 **Fase 1: Fundación (Días 1-2)**
- [x] Crear estructura de archivos base
- [x] Implementar CartSidebar con layout responsive
- [x] Añadir animaciones de entrada/salida
- [x] Footer simple EU compliance

### 🔧 **Fase 2: Funcionalidad Core (Días 3-4)**
- [x] Sistema de persistencia con TTL
- [x] CartHeader con pestañas Delivery/Collection
- [x] CartItem optimizado para mobile/desktop
- [x] CartSummary con cálculos detallados

### 🧠 **Fase 3: Inteligencia (Días 5-6)**  
- [x] Motor de sugerencias contextual
- [x] CartSuggestions con carrusel
- [x] Hooks personalizados (useCart, useCartSuggestions)
- [ ] Integración completa i18n

### 🧪 **Fase 4: Testing y Refinamiento (Día 7)**
- [ ] Testing responsivo en todos los dispositivos
- [ ] Validación de persistencia y TTL
- [ ] Performance optimization
- [ ] Documentación de uso

### 🏁 **Fase 5: Integración Final (Día 8)**
- [ ] Migración del cart actual al nuevo sistema
- [ ] Testing de regresión completo
- [ ] Deployment y validación en producción

---

## 🧪 TESTING CHECKLIST

### 📱 **Mobile Testing**
- [ ] Sidebar se abre suavemente desde derecha
- [ ] Touch gestures funcionan correctamente (+/-)
- [ ] Scroll vertical fluido en contenido largo
- [ ] Pestañas delivery/collection responsive
- [ ] Botón cerrar accesible en todas las resoluciones

### 🖥️ **Desktop Testing**
- [ ] Panel lateral no interfiere con contenido principal
- [ ] Hover states funcionan en todos los elementos
- [ ] Carrusel de sugerencias navegable con flechas
- [ ] Layout se adapta a ventanas estrechas
- [ ] Teclado navigation (Tab, Enter, Esc)

### 💾 **Persistencia Testing**
- [ ] Cart se guarda automáticamente en localStorage
- [ ] TTL funciona correctamente (24h anónimo, 7d usuario)
- [ ] Cleanup automático de caches expirados
- [ ] Migración de datos entre versiones del schema
- [ ] Manejo de localStorage lleno o corrupto

### 🧠 **Sugerencias Testing**
- [ ] Sugerencias cambian según contenido del cart
- [ ] Lógica contextual funciona (hora, día semana)
- [ ] Performance con cálculos de relevancia
- [ ] Fallbacks cuando no hay sugerencias disponibles
- [ ] Integración con datos reales del menú

---

## 📊 MÉTRICAS DE ÉXITO

### 🎯 **KPIs Técnicos**
- **Performance:** Sidebar abre en <300ms
- **Memory:** Cache <5MB en localStorage
- **Battery:** Sin drain por polling/timers activos
- **Accessibility:** Score >95 en Lighthouse

### 💰 **KPIs de Negocio** 
- **Average Order Value:** Incremento por sugerencias
- **Cart Abandonment:** Reducción vs footer cart
- **User Engagement:** Tiempo en cart sidebar
- **Conversion Rate:** Checkout completion rate

---

## 🔍 NOTAS DE DESARROLLO

### ⚠️ **Challenges Conocidos**
1. **Animaciones suaves** en dispositivos de gama baja
2. **Gestión de memoria** con caches grandes
3. **Sync entre pestañas** del cart state
4. **Performance** del motor de sugerencias

### 💡 **Optimizaciones Futuras**
- **Service Worker** para sync offline
- **WebRTC** para sync real-time entre dispositivos
- **ML/AI** para sugerencias personalizadas avanzadas
- **A/B Testing** framework para optimizar conversiones

### 🎨 **Design Tokens**
```css
:root {
  --cart-sidebar-width: 400px;
  --cart-mobile-width: 100vw;
  --cart-backdrop-color: rgba(0, 0, 0, 0.5);
  --cart-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  --cart-border-radius: 12px;
  --cart-transition-duration: 300ms;
  --cart-transition-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

---

## 📚 RECURSOS Y REFERENCIAS

### 🔗 **Links Útiles**
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [EU GDPR Compliance](https://gdpr.eu/compliance/)
- [React Performance Best Practices](https://react.dev/learn/render-and-commit)
- [Tailwind CSS Components](https://tailwindui.com/components)

### 📖 **Documentación Interna**
- `CART_CURRENT_ANALYSIS.md` - Análisis del cart actual
- `DESIGN_SYSTEM.md` - Sistema de diseño del proyecto  
- `API_CART_INTEGRATION.md` - Integración con APIs existentes

---

**⏰ Última actualización:** 17 de Junio, 2025  
**👤 Desarrollador:** GitHub Copilot  
**📝 Estado:** Documentación completa - Listo para desarrollo
