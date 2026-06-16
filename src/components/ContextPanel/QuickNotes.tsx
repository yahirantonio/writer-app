'use client';

import React from 'react';
import { useWriterStore } from '@/stores/useWriterStore';

export function QuickNotes() {
  const quickNotes = useWriterStore((s) => s.quickNotes);
  const setQuickNotes = useWriterStore((s) => s.setQuickNotes);

  return (
    <div className="context-section">
      <div className="context-section-header">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Notas Rápidas
        </h3>
      </div>
      <textarea
        value={quickNotes}
        onChange={(e) => setQuickNotes(e.target.value)}
        placeholder="Escribe ideas, recordatorios, tramas…"
        className="quick-notes-textarea"
        rows={8}
      />
    </div>
  );
}
