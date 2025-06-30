# CampusWeb Restaurant (Fast Pizza Campus)

## Descripción

CampusWeb Restaurant es una aplicación moderna para pedidos de pizza y comida, optimizada para WhatsApp y flujos rápidos de checkout. Permite a los clientes realizar pedidos para entrega o recogida, con integración directa a WhatsApp y filtros avanzados de menú (alérgenos, vegetariano, vegano).

## Demo en Vivo

- [campusweb-restaurant.vercel.app](https://campusweb-restaurant.vercel.app)

## Instalación y Ejecución

1. Clona el repositorio:
   ```
   git clone <TU_REPO_GITHUB>
   cd campus-pizza-frontend
   ```
2. Instala dependencias:
   ```
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```
   npm run dev
   ```

## Funcionalidades Principales

- Pedido rápido vía WhatsApp (checkout directo)
- Filtros de menú: alérgenos críticos, vegetariano, vegano
- Solo pago en efectivo (opción de tarjeta desactivada)
- Validación de zonas de entrega y mínimo de pedido
- Traducciones DE/EN completas y revisadas
- Limpieza de código, modularización y documentación por fases

## Stack Tecnológico

- React + TypeScript
- Tailwind CSS
- Redux
- Vite
- Vercel (deploy)

## Estructura Destacada

- `src/features/order/CheckoutForm.tsx`: Lógica de checkout y métodos de pago
- `src/services/whatsappService.ts`: Integración WhatsApp y número de contacto
- `src/i18n/locales/`: Traducciones DE/EN
- `src/features/menu/`: Filtros y lógica de menú

## Notas

- El flujo de pago con tarjeta está desactivado por defecto (solo efectivo visible en checkout).
- El número de WhatsApp está centralizado en `whatsappService.ts` y usado en la confirmación de pedido.
- El despliegue principal está en Vercel bajo el proyecto `campusweb-restaurant`.

---

Para feedback o mejoras, consulta la documentación de cada fase y los archivos de feedback incluidos en el repositorio.
