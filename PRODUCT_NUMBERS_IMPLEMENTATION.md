# 🔢 Product Numbers Display - Feature Implementation

## 📋 Objetivo
Implementar números de producto visibles en toda la aplicación para facilitar el procesamiento de pedidos en cocina y mejorar el manejo de reclamos de clientes.

## 🎯 Requisitos del Restaurante

### **Numeración de Productos**
- **Rango**: ID 1-125 (asignado por el restaurante)
- **Uso en Cocina**: Facilita preparación de pedidos
- **Uso en Reclamos**: Cliente puede referenciar producto específico por número
- **Ejemplo**: "Pizza Margherita #12" en lugar de solo "Pizza Margherita"

### **Ubicación Visual**
- **Desktop**: Al final de la línea del nombre del producto, lado derecho
- **Mobile**: Según sugerencia UX (a determinar)

## 🚀 Implementación Planificada

### **1. Componentes a Modificar**

#### **📱 Páginas de Productos**
- `src/features/menu/MenuItem.tsx` - Cards de productos principales
- `src/features/menu/MenuItemCompact.tsx` - Cards compactos
- `src/features/menu/PizzaDetailsModal.tsx` - Modal de detalles

#### **🛒 Sistema de Carrito**
- `src/features/cart/CartItem.tsx` - Items individuales en carrito
- `src/features/cart/CartSuggestions.tsx` - Sugerencias de productos
- `src/features/cart/CartSummary.tsx` - Resumen del carrito

#### **📝 Sistema de Órdenes**
- `src/features/order/CheckoutForm.tsx` - Resumen en checkout
- `src/features/order/OrderConfirmation.tsx` - Confirmación de orden
- **WhatsApp Message**: Incluir números en mensaje a restaurante

### **2. Estructura de Datos**

#### **Productos Existentes**
```typescript
// Pizza products (1-100)
{
  id: 12,
  name: "Pizza Margherita",
  // ... otros campos
}

// Non-pizza items (101-125)  
{
  id: 102,
  name: "Tiramisu",
  // ... otros campos
}
```

#### **Display Format**
```typescript
// Desktop: "Pizza Margherita #12"
// Mobile: "Pizza Margherita\n#12" (segunda línea)
// WhatsApp: "1x Pizza Margherita (#12) - €12.00"
```

### **3. Casos de Uso**

#### **🔍 Navegación de Productos**
- Cliente ve "Pizza Margherita #12" en el menú
- Facilita identificación rápida del producto

#### **🛒 Carrito de Compras**
- Items muestran "#12" junto al nombre
- Cliente puede verificar productos antes de ordenar

#### **📞 Procesamiento en Cocina**
```
Orden #CP240620001
📋 Productos:
1x Pizza Margherita (#12) - €12.00
2x Tiramisu (#102) - €13.80
1x Coca-Cola (#101) - €3.50
```

#### **🛠️ Manejo de Reclamos**
- Cliente: "Hay un problema con el producto #12"
- Restaurante identifica inmediatamente: Pizza Margherita

### **4. Consideraciones UX/UI**

#### **🎨 Diseño Visual**
- **Color**: Gris claro para no dominar el nombre
- **Tamaño**: Ligeramente más pequeño que el nombre principal
- **Posición Desktop**: `flex justify-between` con número a la derecha
- **Posición Mobile**: Debajo del nombre, alineación derecha

#### **📱 Responsive Design**
```css
/* Desktop */
.product-name-desktop {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Mobile */
.product-name-mobile {
  flex-direction: column;
  align-items: flex-start;
}

.product-number {
  font-size: 0.875rem;
  color: #6b7280; /* gray-500 */
  font-weight: 500;
}
```

### **5. Internacionalización**

#### **Traducciones Requeridas**
```json
// en.json
{
  "product": {
    "number": "#{{number}}",
    "productWithNumber": "{{name}} #{{number}}"
  }
}

// de.json  
{
  "product": {
    "number": "#{{number}}",
    "productWithNumber": "{{name}} #{{number}}"
  }
}
```

## 🧪 Testing Plan

### **✅ Verificaciones Funcionales**
1. **Producto Individual**: Número visible en card de producto
2. **Carrito**: Números presentes en todos los items
3. **Checkout**: Resumen muestra números correctos
4. **WhatsApp**: Mensaje incluye números de producto
5. **Order Confirmation**: Confirmación muestra números
6. **Responsive**: Funciona correctamente en mobile/desktop

### **🔍 Edge Cases**
- Productos sin número asignado (fallback)
- Números muy largos (truncamiento)
- Productos con nombres largos + número

## 📊 Impacto Esperado

### **🏭 Para el Restaurante**
- ✅ Procesamiento más rápido en cocina
- ✅ Menos errores en preparación de pedidos
- ✅ Manejo eficiente de reclamos
- ✅ Mejor comunicación interna

### **👥 Para el Cliente**
- ✅ Mayor confianza en el pedido correcto
- ✅ Comunicación más clara en reclamos
- ✅ Experiencia más profesional

### **💻 Para el Sistema**
- ✅ Trazabilidad completa de productos
- ✅ Debugging más fácil de pedidos
- ✅ Integración mejorada con sistemas de cocina

---

**Branch**: `feature/product-numbers-display`  
**Estado**: 🚧 En desarrollo  
**Prioridad**: Alta  
**Estimación**: 4-6 horas de desarrollo
