/**
 * 🧪 TEST: Verificación de Corrección de Mindestbestellwert
 * 
 * Este test verifica que los valores corregidos coincidan con los documentos legales
 */

import { DELIVERY_TARIFFS, getTariffByPLZ, calculateDeliveryFee } from '../deliveryTariffs';

describe('Mindestbestellwert Correcciones', () => {
  
  describe('Valores de Mindestbestellwert corregidos', () => {
    test('Zone 1 (Campus) debe tener mindestbestellwert de €12.00', () => {
      const zone1PLZ = ['44149', '44147', '44137'];
      
      zone1PLZ.forEach(plz => {
        const tariff = getTariffByPLZ(plz);
        expect(tariff).toBeTruthy();
        expect(tariff?.mindestbestellwert).toBe(12.00);
        expect(tariff?.id).toBe('zone-1-campus');
      });
    });

    test('Zone 2 (City) debe tener mindestbestellwert de €15.00', () => {
      const zone2PLZ = ['44135', '44139', '44388', '44145', '44143', '44141', '44229', '44225', '44227', '44369', '44379'];
      
      zone2PLZ.forEach(plz => {
        const tariff = getTariffByPLZ(plz);
        expect(tariff).toBeTruthy();
        expect(tariff?.mindestbestellwert).toBe(15.00);
        expect(tariff?.id).toBe('zone-2-city');
      });
    });

    test('Zone 3 (Outer) debe tener mindestbestellwert de €20.00', () => {
      const zone3PLZ = ['44357', '44359', '44265', '44263'];
      
      zone3PLZ.forEach(plz => {
        const tariff = getTariffByPLZ(plz);
        expect(tariff).toBeTruthy();
        expect(tariff?.mindestbestellwert).toBe(20.00);
        expect(tariff?.id).toBe('zone-3-outer');
      });
    });

    test('Pickup debe tener mindestbestellwert de €10.00', () => {
      const tariff = getTariffByPLZ('abholung');
      expect(tariff).toBeTruthy();
      expect(tariff?.mindestbestellwert).toBe(10.00);
      expect(tariff?.id).toBe('pickup');
    });
  });

  describe('Validación de costos de delivery', () => {
    test('Zone 1: Delivery gratis desde €12.00', () => {
      const result = calculateDeliveryFee('44149', 12.00);
      expect(result.fee).toBe(0.00);
      expect(result.isFree).toBe(true);
      expect(result.meetsMinimum).toBe(true);
    });

    test('Zone 2: €1.50 delivery, gratis desde €40.00', () => {
      const resultBelow = calculateDeliveryFee('44135', 30.00);
      expect(resultBelow.fee).toBe(1.50);
      expect(resultBelow.isFree).toBe(false);
      expect(resultBelow.meetsMinimum).toBe(true);

      const resultFree = calculateDeliveryFee('44135', 40.00);
      expect(resultFree.fee).toBe(0.00);
      expect(resultFree.isFree).toBe(true);
      expect(resultFree.meetsMinimum).toBe(true);
    });

    test('Zone 3: €2.00 delivery, gratis desde €50.00', () => {
      const resultBelow = calculateDeliveryFee('44357', 35.00);
      expect(resultBelow.fee).toBe(2.00);
      expect(resultBelow.isFree).toBe(false);
      expect(resultBelow.meetsMinimum).toBe(true);

      const resultFree = calculateDeliveryFee('44357', 50.00);
      expect(resultFree.fee).toBe(0.00);
      expect(resultFree.isFree).toBe(true);
      expect(resultFree.meetsMinimum).toBe(true);
    });
  });

  describe('Validación de mindestbestellwert', () => {
    test('Zone 1: Pedido bajo €12.00 no debe pasar', () => {
      const result = calculateDeliveryFee('44149', 10.00);
      expect(result.meetsMinimum).toBe(false);
      expect(result.missingAmount).toBe(2.00);
    });

    test('Zone 2: Pedido bajo €15.00 no debe pasar', () => {
      const result = calculateDeliveryFee('44135', 12.00);
      expect(result.meetsMinimum).toBe(false);
      expect(result.missingAmount).toBe(3.00);
    });

    test('Zone 3: Pedido bajo €20.00 no debe pasar', () => {
      const result = calculateDeliveryFee('44357', 18.00);
      expect(result.meetsMinimum).toBe(false);
      expect(result.missingAmount).toBe(2.00);
    });

    test('Pickup: Pedido bajo €10.00 no debe pasar', () => {
      const result = calculateDeliveryFee('abholung', 8.00);
      expect(result.meetsMinimum).toBe(false);
      expect(result.missingAmount).toBe(2.00);
    });
  });

  describe('Cobertura de todos los PLZ', () => {
    test('Todos los PLZ documentados deben tener tarifa', () => {
      const allPLZ = [
        // Zone 1
        '44149', '44147', '44137',
        // Zone 2  
        '44135', '44139', '44388', '44145', '44143', '44141', '44229', '44225', '44227', '44369', '44379',
        // Zone 3
        '44357', '44359', '44265', '44263',
        // Pickup
        'abholung'
      ];

      allPLZ.forEach(plz => {
        const tariff = getTariffByPLZ(plz);
        expect(tariff).toBeTruthy();
        expect(tariff?.isActive).toBe(true);
      });
    });
  });

});
