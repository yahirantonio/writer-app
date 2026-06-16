'use client';

import React, { useState, useEffect } from 'react';
import { useModalStore } from '@/stores/useModalStore';

export function Modal() {
  const { isOpen, config, closeModal } = useModalStore();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen && config?.initialValue) {
      setInputValue(config.initialValue);
    } else {
      setInputValue('');
    }
  }, [isOpen, config]);

  if (!isOpen || !config) return null;

  const handleConfirm = async () => {
    await config.onConfirm(inputValue);
    closeModal();
  };

  const handleCancel = () => {
    if (config.onCancel) config.onCancel();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl p-6 backdrop-blur-md animate-zoom-in">
        <h3 className="text-lg font-medium text-zinc-100 mb-2">
          {config.title}
        </h3>
        
        {config.message && (
          <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
            {config.message}
          </p>
        )}

        {config.type === 'prompt' && (
          <div className="mb-6">
            <input
              autoFocus
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={config.placeholder}
              className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirm();
                if (e.key === 'Escape') handleCancel();
              }}
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {config.cancelLabel || 'Cancelar'}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              config.title.toLowerCase().includes('eliminar')
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                : 'bg-zinc-100 text-zinc-900 hover:bg-white'
            }`}
          >
            {config.confirmLabel || 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
}
