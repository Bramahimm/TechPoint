// src/components/common/SuccessToast.tsx

import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

interface SuccessToastProps {
  message: string;
  duration?: number; // Durasi tampil dalam ms
  onClose: () => void;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ 
    message, 
    duration = 2000, 
    onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      // Set timeout untuk menghilangkan toast setelah durasi tertentu
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); 
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, isVisible]);

  if (!document.body) {
    return null; 
  }
  
  const toastContent = (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'bg-blue-500 bg-opacity-30 opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white p-6 rounded-xl shadow-2xl transform transition-transform duration-300 scale-100 flex flex-col items-center">
        <CheckCircle className="w-12 h-12 text-blue-500 mb-4" />
        <p className="text-xl font-semibold text-gray-800 text-center">
          {message}
        </p>
      </div>
    </div>
  );
  
  return createPortal(toastContent, document.body); 
};

export default SuccessToast;