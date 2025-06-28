import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import WhatsAppService from '../services/whatsappService';
import { OrderData, WhatsAppResult } from '../types/whatsapp';

interface UseWhatsAppIntegrationReturn {
  // Estados
  isModalOpen: boolean;
  isLoading: boolean;
  result: WhatsAppResult | null;
  error: string | null;
  
  // Acciones
  openConfirmation: () => void;
  closeConfirmation: () => void;
  sendOrder: (orderData: OrderData) => Promise<WhatsAppResult>;
  reset: () => void;
  
  // Utilidades
  isWhatsAppAvailable: () => Promise<boolean>;
  formatPreviewMessage: (orderData: OrderData) => string;
}

export function useWhatsAppIntegration(): UseWhatsAppIntegrationReturn {
  const { i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WhatsAppResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openConfirmation = useCallback(() => {
    setIsModalOpen(true);
    setError(null);
    setResult(null);
  }, []);

  const closeConfirmation = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
  }, []);

  const sendOrder = useCallback(async (orderData: OrderData): Promise<WhatsAppResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const whatsappResult = await WhatsAppService.sendOrder(orderData);
      setResult(whatsappResult);
      
      if (!whatsappResult.success) {
        setError(whatsappResult.error || 'Failed to send WhatsApp message');
      }
      
      return whatsappResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      const failureResult: WhatsAppResult = {
        success: false,
        method: 'error',
        error: errorMessage
      };
      setResult(failureResult);
      
      return failureResult;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsModalOpen(false);
    setIsLoading(false);
    setResult(null);
    setError(null);
  }, []);

  const isWhatsAppAvailable = useCallback(async (): Promise<boolean> => {
    try {
      return await WhatsAppService.isWhatsAppAvailable();
    } catch {
      return false;
    }
  }, []);

  const formatPreviewMessage = useCallback((orderData: OrderData): string => {
    return WhatsAppService.formatOrderMessage(orderData, i18n.language);
  }, [i18n.language]);

  return {
    // Estados
    isModalOpen,
    isLoading,
    result,
    error,
    
    // Acciones
    openConfirmation,
    closeConfirmation,
    sendOrder,
    reset,
    
    // Utilidades
    isWhatsAppAvailable,
    formatPreviewMessage
  };
}

export default useWhatsAppIntegration;