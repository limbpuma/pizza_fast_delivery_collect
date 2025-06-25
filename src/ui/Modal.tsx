import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'pizza' | 'multiStep';
  scrollable?: boolean;
  compact?: boolean;
  heightClass?: 'auto' | 'compact' | 'scroll';
}

function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  scrollable = false,
  compact = false,
  heightClass = 'auto'
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    pizza: 'max-w-sm sm:max-w-md lg:max-w-lg',
    multiStep: 'max-w-md sm:max-w-lg'
  };

  const heightClasses = {
    auto: 'max-h-[90vh]',
    compact: 'max-h-[70vh]',
    scroll: 'max-h-[80vh]'
  };

  return createPortal(
    <div className="modal-overlay">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          className={`
            bg-white rounded-lg shadow-xl transform transition-all duration-300 ease-out 
            animate-modalSlide w-full ${sizeClasses[size]} ${heightClasses[heightClass]} 
            overflow-hidden
            ${compact ? 'mx-2 sm:mx-4' : ''}
            ${scrollable ? 'overflow-y-auto' : ''}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 transition-colors hover:text-gray-600"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className={`
            ${scrollable ? 'overflow-y-auto' : ''} 
            ${compact ? 'p-3 sm:p-4' : 'p-4'}
            ${heightClass === 'scroll' ? 'max-h-[calc(80vh-100px)]' : 
              heightClass === 'compact' ? 'max-h-[calc(70vh-100px)]' : 
              'max-h-[calc(90vh-100px)]'}
          `}>
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
