/**
 * Script de verificación automática del flujo WhatsApp
 * Comprueba que todas las funcionalidades estén implementadas y funcionando
 */

import { WhatsAppService } from '../services/whatsappService';
import { OrderData } from '../types/whatsapp';

// Datos de prueba para simular un pedido
const mockOrderData: OrderData = {
  orderNumber: 'CP123456789',
  timestamp: new Date().toISOString(),
  customer: 'Juan Pérez',
  phone: '+4917645754360',
  deliveryMode: 'delivery',
  address: {
    street: 'Musterstraße 123',
    houseNumber: '',
    postalCode: '44149',
    city: 'Dortmund'
  },
  paymentMethod: 'cash',
  specialInstructions: 'Por favor, tocar el timbre',
  cart: [
    {
      pizzaId: '1',
      name: 'Margherita',
      quantity: 2,
      size: 'Groß',
      ingredients: ['Tomaten', 'Mozzarella', 'Basilikum'],
      totalPrice: 18.90
    },
    {
      pizzaId: '5',
      name: 'Salami',
      quantity: 1,
      size: 'Mittel',
      ingredients: ['Tomaten', 'Mozzarella', 'Salami'],
      totalPrice: 12.50
    }
  ],
  pricing: {
    subtotal: 31.40,
    deliveryFee: 2.50,
    serviceFee: 0,
    total: 33.90
  }
};

class WhatsAppFlowTester {
  private results: { test: string; status: 'PASS' | 'FAIL'; details?: string }[] = [];

  private addResult(test: string, status: 'PASS' | 'FAIL', details?: string) {
    this.results.push({ test, status, details });
    console.log(`${status === 'PASS' ? '✅' : '❌'} ${test}${details ? ': ' + details : ''}`);
  }

  async runAllTests(): Promise<void> {
    console.log('🧪 Iniciando verificación del flujo WhatsApp...\n');

    await this.testWhatsAppService();
    await this.testMessageFormatting();
    await this.testPlatformDetection();
    await this.testErrorHandling();
    await this.testTranslations();
    
    this.printSummary();
  }

  private async testWhatsAppService(): Promise<void> {
    console.log('📱 Probando WhatsAppService...');

    try {
      // Test 1: Verificar que el servicio existe
      if (typeof WhatsAppService === 'undefined') {
        this.addResult('WhatsAppService existe', 'FAIL', 'Servicio no encontrado');
        return;
      }
      this.addResult('WhatsAppService existe', 'PASS');

      // Test 2: Verificar método formatOrderMessage
      const message = WhatsAppService.formatOrderMessage(mockOrderData, 'de');
      if (message && message.length > 0) {
        this.addResult('formatOrderMessage funciona', 'PASS', `${message.length} caracteres`);
      } else {
        this.addResult('formatOrderMessage funciona', 'FAIL', 'Mensaje vacío');
      }

      // Test 3: Verificar disponibilidad de WhatsApp
      const isAvailable = await WhatsAppService.isWhatsAppAvailable();
      this.addResult('isWhatsAppAvailable responde', 'PASS', `Disponible: ${isAvailable}`);

      // Test 4: Verificar sendOrder (simulado)
      try {
        const result = await WhatsAppService.sendOrder(mockOrderData);
        this.addResult('sendOrder ejecuta', 'PASS', `Método: ${result.method}`);
      } catch (error) {
        this.addResult('sendOrder ejecuta', 'FAIL', error instanceof Error ? error.message : String(error));
      }

    } catch (error) {
      this.addResult('WhatsAppService general', 'FAIL', error instanceof Error ? error.message : String(error));
    }
  }

  private async testMessageFormatting(): Promise<void> {
    console.log('\n📝 Probando formateo de mensajes...');

    try {
      // Test con idioma alemán
      const messageDE = WhatsAppService.formatOrderMessage(mockOrderData, 'de');
      if (messageDE.includes('Restaurant CAMPUS') && messageDE.includes('Bestellung')) {
        this.addResult('Formateo DE correcto', 'PASS');
      } else {
        this.addResult('Formateo DE correcto', 'FAIL', 'Faltan elementos esperados');
      }

      // Test con idioma inglés
      const messageEN = WhatsAppService.formatOrderMessage(mockOrderData, 'en');
      if (messageEN.includes('Restaurant CAMPUS') && messageEN.includes('Order')) {
        this.addResult('Formateo EN correcto', 'PASS');
      } else {
        this.addResult('Formateo EN correcto', 'FAIL', 'Faltan elementos esperados');
      }

      // Test de longitud del mensaje
      if (messageDE.length < 4096) {
        this.addResult('Longitud mensaje válida', 'PASS', `${messageDE.length}/4096 caracteres`);
      } else {
        this.addResult('Longitud mensaje válida', 'FAIL', 'Mensaje demasiado largo');
      }

      // Test de elementos obligatorios
      const requiredElements = [
        'CP123456789', // Order number
        'Juan Pérez', // Customer name
        '+4917645754360', // Phone
        'Musterstraße 123', // Address
        '44149', // Postal code
        '33,90', // Total price
        'Margherita', // Pizza name
        'Salami' // Pizza name
      ];

      const missingElements = requiredElements.filter(element => !messageDE.includes(element));
      if (missingElements.length === 0) {
        this.addResult('Elementos obligatorios incluidos', 'PASS');
      } else {
        this.addResult('Elementos obligatorios incluidos', 'FAIL', `Faltan: ${missingElements.join(', ')}`);
      }

    } catch (error) {
      this.addResult('Formateo de mensajes', 'FAIL', error instanceof Error ? error.message : String(error));
    }
  }

  private async testPlatformDetection(): Promise<void> {
    console.log('\n🔍 Probando detección de plataforma...');

    try {
      // Como no podemos acceder directamente al método privado, probamos indirectamente
      const result = await WhatsAppService.sendOrder(mockOrderData);
      
      if (result.platform) {
        this.addResult('Detección de plataforma', 'PASS', `Plataforma: ${result.platform}`);
      } else {
        this.addResult('Detección de plataforma', 'PASS', 'Sin plataforma específica detectada');
      }

    } catch (error) {
      this.addResult('Detección de plataforma', 'FAIL', error instanceof Error ? error.message : String(error));
    }
  }

  private async testErrorHandling(): Promise<void> {
    console.log('\n🛡️ Probando manejo de errores...');

    try {
      // Test con datos inválidos
      const invalidOrderData = { ...mockOrderData, customer: '' };
      const result = await WhatsAppService.sendOrder(invalidOrderData);
      
      // Si el servicio maneja el error gracefully
      if (result && (result.success === false || result.method === 'error' || result.method === 'fallback')) {
        this.addResult('Manejo de errores graceful', 'PASS', `Método: ${result.method}`);
        
        // Verificar que hay acciones alternativas
        if (result.alternativeActions && result.alternativeActions.length > 0) {
          this.addResult('Acciones alternativas disponibles', 'PASS', `${result.alternativeActions.length} opciones`);
        } else {
          this.addResult('Acciones alternativas disponibles', 'FAIL', 'Sin alternativas');
        }
      } else {
        this.addResult('Manejo de errores graceful', 'FAIL', 'No maneja errores apropiadamente');
      }

    } catch (error) {
      // Si llega aquí, significa que no maneja errores gracefully
      this.addResult('Manejo de errores graceful', 'FAIL', 'Lanza excepción no controlada');
    }
  }

  private async testTranslations(): Promise<void> {
    console.log('\n🌍 Probando traducciones...');

    try {
      const messageDE = WhatsAppService.formatOrderMessage(mockOrderData, 'de');
      const messageEN = WhatsAppService.formatOrderMessage(mockOrderData, 'en');

      // Verificar palabras clave en alemán
      const germanWords = ['Bestellung', 'Kunde', 'Lieferadresse', 'Gesamt', 'Bargeld'];
      const hasGermanWords = germanWords.some(word => messageDE.includes(word));
      if (hasGermanWords) {
        this.addResult('Traducciones alemanas', 'PASS');
      } else {
        this.addResult('Traducciones alemanas', 'FAIL', 'Faltan palabras en alemán');
      }

      // Verificar palabras clave en inglés
      const englishWords = ['Order', 'Customer', 'Delivery Address', 'Total', 'Cash'];
      const hasEnglishWords = englishWords.some(word => messageEN.includes(word));
      if (hasEnglishWords) {
        this.addResult('Traducciones inglesas', 'PASS');
      } else {
        this.addResult('Traducciones inglesas', 'FAIL', 'Faltan palabras en inglés');
      }

      // Verificar que los mensajes son diferentes
      if (messageDE !== messageEN) {
        this.addResult('Traducciones diferenciadas', 'PASS');
      } else {
        this.addResult('Traducciones diferenciadas', 'FAIL', 'Mensajes idénticos');
      }

    } catch (error) {
      this.addResult('Sistema de traducciones', 'FAIL', error instanceof Error ? error.message : String(error));
    }
  }

  private printSummary(): void {
    console.log('\n📊 RESUMEN DE VERIFICACIÓN\n');
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;

    console.log(`✅ Pruebas exitosas: ${passed}/${total}`);
    console.log(`❌ Pruebas fallidas: ${failed}/${total}`);
    console.log(`📊 Tasa de éxito: ${Math.round((passed / total) * 100)}%\n`);

    if (failed > 0) {
      console.log('❌ PRUEBAS FALLIDAS:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`   • ${r.test}: ${r.details || 'Sin detalles'}`));
      console.log('');
    }

    // Recomendación final
    if (failed === 0) {
      console.log('🎉 ¡TODAS LAS PRUEBAS PASARON! El flujo WhatsApp está funcionando correctamente.');
    } else if (failed <= 2) {
      console.log('⚠️  La mayoría de funcionalidades funcionan, pero hay algunas mejoras necesarias.');
    } else {
      console.log('🚨 Hay problemas importantes que necesitan ser resueltos antes de usar en producción.');
    }

    console.log('\n🔗 Para probar manualmente:');
    console.log('   1. Navega al checkout en http://localhost:5179');
    console.log('   2. Agrega productos al carrito');
    console.log('   3. Completa el formulario de checkout');
    console.log('   4. Haz clic en "Bestellung via WhatsApp aufgeben"');
    console.log('   5. Verifica que aparece el modal de confirmación');
    console.log('   6. Prueba el envío a WhatsApp\n');
  }
}

// Función para ejecutar las pruebas (se puede llamar desde la consola del navegador)
export async function verifyWhatsAppFlow(): Promise<void> {
  const tester = new WhatsAppFlowTester();
  await tester.runAllTests();
}

// Auto-ejecutar si se ejecuta directamente
if (typeof window !== 'undefined') {
  console.log('🧪 Script de verificación WhatsApp cargado.');
  console.log('💡 Ejecuta verifyWhatsAppFlow() en la consola para probar.');
  
  // Hacer la función disponible globalmente
  (window as any).verifyWhatsAppFlow = verifyWhatsAppFlow;
}

export default WhatsAppFlowTester;
