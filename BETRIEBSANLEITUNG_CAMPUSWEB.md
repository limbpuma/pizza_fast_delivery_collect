# Betriebsanleitung & Zugangsdaten – CampusWeb Restaurant

## 1. Hosting & Deployment (Vercel)

- **Provider:** Vercel (https://vercel.com)
- **Projekt:** campusweb-restaurant
- **Deployment:** Automatisch über GitHub Push oder manuell per Vercel CLI

### Zugangsdaten Vercel
- **Login:** Mit Google-Account (siehe unten)
- **Token Dev:** `GnlqAcBBuph0OBEipOLwwHmg`

#### Schritte für Deployment/Verwaltung:
1. Gehe zu https://vercel.com und logge dich mit dem Google-Account ein.
2. Das Projekt `campusweb-restaurant` ist bereits angelegt und mit dem GitHub-Repo verbunden.
3. Für manuelles Deployment im Projektordner:
   ```
   vercel --prod
   ```
   (Vercel CLI muss installiert sein: `npm i -g vercel`)

## 2. Google-Account (für Vercel Login)
- **E-Mail:** restaurantcampuscampus@gmail.com
- **Passwort:** Campus1234

## 3. Domain (NameCheap)
- **Provider:** https://namecheap.com
- **Passwort:** ##Campusrestaurant-25
- Domain ist mit Vercel verbunden (DNS-Einträge ggf. in Vercel/NameCheap prüfen)

## 4. Projektstruktur & Hinweise
- **Frontend:** React + TypeScript (Vite)
- **Checkout:** WhatsApp-Integration, nur Barzahlung aktiviert
- **Menü:** Filter für Allergene, vegetarisch, vegan
- **Sprachen:** Deutsch/Englisch (DE/EN)
- **Deploy:** Hauptdeployment auf Vercel, Änderungen per GitHub Push oder Vercel CLI

## 5. Wichtige Dateien
- `src/features/order/CheckoutForm.tsx` – Checkout-Logik
- `src/services/whatsappService.ts` – WhatsApp-Nummer & Integration
- `src/i18n/locales/` – Übersetzungen
- `readme.md` – Projektübersicht (auf Englisch)

## 6. Support & Anpassungen
- Für Änderungen: Code im GitHub-Repo anpassen und pushen, oder lokal deployen mit Vercel CLI.
- Bei Problemen mit Domain oder Hosting: Zugangsdaten oben nutzen.

---

**Hinweis:** Zugangsdaten sicher aufbewahren und nicht öffentlich teilen!
