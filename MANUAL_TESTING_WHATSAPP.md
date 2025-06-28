# Manual Testing Guide - WhatsApp Integration

## Pre-requisitos
1. Servidor dev corriendo: `npm run dev`
2. Navegador abierto en `http://localhost:5177`

## Test Flow Completo

### 1. Navegación Inicial ✅
- [ ] Página de inicio carga correctamente
- [ ] Menú disponible y funcional
- [ ] Productos visibles

### 2. Agregar Productos al Carrito ✅
- [ ] Abrir modal de pizza
- [ ] Seleccionar tamaño e ingredientes
- [ ] Agregar al carrito
- [ ] Verificar contador del carrito

### 3. Proceso de Checkout ✅
- [ ] Navegar a carrito/checkout
- [ ] Seleccionar modo de entrega (delivery/collection)
- [ ] Completar información del cliente:
  - [ ] Nombre completo
  - [ ] Teléfono (+49...)
  - [ ] Dirección (si delivery)
  - [ ] Código postal válido (44xxx)
  - [ ] Método de pago

### 4. WhatsApp Integration Testing ✅

#### 4.1 Modal de Confirmación
- [ ] Hacer clic en "Place Order via WhatsApp"
- [ ] Verificar que aparece WhatsAppConfirmationModal
- [ ] Verificar contenido del modal:
  - [ ] Información del pedido
  - [ ] Botón "Show Preview"
  - [ ] Botones Cancel/Edit/Send

#### 4.2 Preview del Mensaje
- [ ] Hacer clic en "Show Preview"
- [ ] Verificar formato del mensaje WhatsApp:
  - [ ] Número de pedido
  - [ ] Información del cliente
  - [ ] Lista de productos
  - [ ] Precio total
  - [ ] Dirección (si delivery)
  - [ ] Método de pago

#### 4.3 Envío a WhatsApp
- [ ] Hacer clic en "Send to WhatsApp"
- [ ] Verificar redirección:
  - [ ] **Móvil**: `whatsapp://send?text=...`
  - [ ] **Desktop**: `https://web.whatsapp.com/send?text=...`

#### 4.4 Manejo de Errores
- [ ] Si WhatsApp no está disponible:
  - [ ] Aparece WhatsAppResultModal
  - [ ] Muestra información de contacto alternativa
  - [ ] Botón de reintentar disponible

### 5. Testing por Dispositivo

#### 5.1 Desktop 💻
- [ ] Chrome
- [ ] Firefox  
- [ ] Edge
- [ ] Safari

#### 5.2 Móvil 📱
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Samsung Browser
- [ ] WhatsApp nativo instalado

### 6. Testing de Idiomas 🌍
- [ ] Alemán (DE) - todos los textos
- [ ] Inglés (EN) - todos los textos
- [ ] Cambio de idioma en tiempo real

### 7. Casos Edge

#### 7.1 Validaciones
- [ ] Formulario incompleto
- [ ] Teléfono inválido
- [ ] PLZ no válido (fuera de zona)
- [ ] Pedido mínimo no alcanzado

#### 7.2 Estados de Carga
- [ ] Loading en modal de confirmación
- [ ] Deshabilitar botones durante envío
- [ ] Manejo de timeouts

#### 7.3 Navegación
- [ ] Back button durante proceso
- [ ] Refresh en checkout
- [ ] Múltiples clicks en submit

## Criterios de Aceptación

### ✅ Funcionalidad Básica
- Modal de confirmación aparece y funciona
- Preview del mensaje es correcto y completo
- Redirección a WhatsApp funciona
- Formato del mensaje es profesional

### ✅ UX/UI
- Modales son responsive
- Estados de loading son claros
- Botones están bien posicionados
- Textos están traducidos

### ✅ Robustez
- Manejo de errores graceful
- No hay crashes por clicks múltiples
- Validaciones funcionan correctamente
- Performance aceptable

### ✅ Cross-Platform
- Funciona en móvil y desktop
- Detecta correctamente el entorno
- Fallbacks apropiados

## Reporte de Issues

### Template de Bug Report:
```
**Dispositivo:** [Mobile/Desktop]
**Navegador:** [Chrome/Safari/etc]
**OS:** [iOS/Android/Windows/macOS]
**Pasos para reproducir:**
1. 
2. 
3. 

**Resultado esperado:**
**Resultado actual:**
**Screenshots/Console errors:**
```

## Sign-off

- [ ] **Frontend Developer:** Implementación completa y funcional
- [ ] **QA Tester:** Testing manual completado sin issues críticos  
- [ ] **Product Owner:** UX aprobada y cumple requisitos
- [ ] **DevOps:** Build y deployment verificados

## Next Steps

Después del testing exitoso:
1. Merge a `master`
2. Deploy a producción
3. Monitoreo de errores
4. Feedback de usuarios reales
