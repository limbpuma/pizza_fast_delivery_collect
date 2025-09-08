// Hook for preventing duplicate order submissions
import { useState, useRef, useEffect } from 'react';

interface UseOrderSubmissionOptions {
  timeout?: number; // Timeout in milliseconds to reset submission state
}

export function useOrderSubmission(options: UseOrderSubmissionOptions = {}) {
  const { timeout = 5000 } = options; // Default 5 seconds timeout
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const lastSubmissionTime = useRef<number>(0);
  
  const startSubmission = (): boolean => {
    const now = Date.now();
    
    // Prevent submissions within 2 seconds of each other
    if (now - lastSubmissionTime.current < 2000) {
      console.log('🔄 Submission blocked - too soon after last attempt');
      return false;
    }
    
    if (isSubmitting) {
      console.log('🔄 Submission blocked - already in progress');
      return false;
    }
    
    setIsSubmitting(true);
    lastSubmissionTime.current = now;
    
    // Set a timeout to automatically reset submission state
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      console.log('⏰ Order submission timeout - resetting state');
      setIsSubmitting(false);
    }, timeout) as number;
    
    console.log('🚀 Order submission started');
    return true;
  };
  
  const endSubmission = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsSubmitting(false);
    console.log('✅ Order submission completed');
  };
  
  const resetSubmission = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsSubmitting(false);
    console.log('🔄 Order submission reset');
  };
    // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return {
    isSubmitting,
    startSubmission,
    endSubmission,
    resetSubmission
  };
}
