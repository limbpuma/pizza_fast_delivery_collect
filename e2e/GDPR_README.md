# 🇩🇪 GDPR Compliance Tests

## Overview
This test suite validates GDPR (General Data Protection Regulation) compliance for the German market, ensuring the application meets all data protection requirements under DSGVO (Datenschutz-Grundverordnung).

## Test Coverage

### 🍪 Cookie Compliance
- ✅ **Cookie Banner Display**: Verifies compliant cookie consent banner
- ✅ **Granular Control**: Tests individual cookie category management
- ✅ **Consent Withdrawal**: Validates ability to change consent preferences
- ✅ **German Language**: Ensures GDPR terms in German (DSGVO)

### 📋 Legal Requirements
- ✅ **Privacy Policy**: Checks accessibility of Datenschutzerklärung
- ✅ **Impressum**: Validates German legal notice requirement
- ✅ **Contact Information**: Verifies Data Protection Officer contact
- ✅ **Right to Information**: Tests access to data processing details

### 🛡️ Data Protection
- ✅ **Purpose Limitation**: Verifies data collection for specific purposes
- ✅ **Data Minimization**: Ensures only necessary data is collected
- ✅ **Retention Periods**: Checks data storage duration compliance
- ✅ **Cross-border Transfers**: Validates WhatsApp/Meta disclosures

### 🔒 User Rights
- ✅ **Consent Management**: Tests opt-in/opt-out mechanisms
- ✅ **Data Subject Rights**: Validates access, rectification, erasure rights
- ✅ **Transparent Processing**: Ensures clear data processing information
- ✅ **Lawful Basis**: Verifies legal grounds for data processing

## Running GDPR Tests

### Quick Start
```bash
# Run all GDPR compliance tests
npm run test:gdpr

# Run with browser visible
npm run test:gdpr --headed

# Generate detailed report
npm run test:gdpr --reporter=html
```

### Individual Test Categories
```bash
# Cookie compliance only
npx playwright test gdpr.spec.ts --grep "cookie"

# Legal pages validation
npx playwright test gdpr.spec.ts --grep "privacy policy"

# Data protection checks
npx playwright test gdpr.spec.ts --grep "personal data"

# German language compliance
npx playwright test gdpr.spec.ts --grep "german language"
```

## Test Results Interpretation

### ✅ **Compliant Indicators**
- Cookie banner appears with proper options
- Accept, Reject, and Settings buttons available
- German GDPR terminology used correctly
- Privacy policy and Impressum accessible
- Data processing purposes clearly stated

### ⚠️ **Warning Signs**
- Missing consent withdrawal options
- No granular cookie controls
- Unclear data retention policies
- Missing Data Protection Officer contact
- Cross-border transfer without disclosure

### ❌ **Non-Compliance Issues**
- No cookie banner or consent mechanism
- Missing required legal pages
- Data collection without clear purpose
- No option to refuse non-essential cookies
- Missing German language compliance

## German GDPR Requirements Checklist

### 🍪 **Cookie Law (ePrivacy)**
- [ ] Cookie consent banner on first visit
- [ ] Clear accept/reject options
- [ ] Granular cookie category control
- [ ] Ability to withdraw consent
- [ ] Pre-checked boxes prohibited

### 📄 **Information Requirements (Art. 13 GDPR)**
- [ ] Identity of data controller
- [ ] Contact details of DPO (if applicable)
- [ ] Purposes of data processing
- [ ] Legal basis for processing
- [ ] Retention periods
- [ ] Data subject rights information

### 🔗 **Legal Pages**
- [ ] Datenschutzerklärung (Privacy Policy)
- [ ] Impressum (Legal Notice)
- [ ] Contact information
- [ ] Terms of service (if applicable)

### 🌍 **Third-Party Integrations**
- [ ] WhatsApp data transfer disclosure
- [ ] Meta/Facebook data sharing notice
- [ ] Adequacy decisions or safeguards
- [ ] User consent for third-party data sharing

## Compliance Notes

### WhatsApp Integration
The application uses WhatsApp for order completion, which involves:
- Data transfer to Meta (Facebook)
- Cross-border data transfer (Ireland/US)
- User consent required for messaging
- Disclosure of third-party data sharing

### Data Minimization
Order processing collects minimal data:
- Name (for order identification)
- Phone (for delivery/pickup contact)
- Address (delivery orders only)
- No payment data stored (cash only)

### Retention Policy
- Order data: Processed via WhatsApp
- Session data: Browser session only
- Cookies: User-controlled retention
- No long-term data storage

## Common Issues & Solutions

### Issue: Cookie banner not appearing
**Solution**: Check for content blockers, verify banner implementation

### Issue: No reject option for cookies
**Solution**: Implement "Only necessary cookies" button

### Issue: Missing privacy policy
**Solution**: Add Datenschutzerklärung link in footer

### Issue: English-only compliance texts
**Solution**: Translate all GDPR texts to German

### Issue: Unclear data processing purposes
**Solution**: Add explicit purpose statements in forms

## Legal Disclaimer
These tests provide technical validation of GDPR compliance features but do not constitute legal advice. For complete GDPR compliance, consult with qualified legal professionals specializing in German data protection law.

---

**Last Updated**: September 2025  
**GDPR Version**: EU 2016/679  
**German Implementation**: BDSG-neu 2018
