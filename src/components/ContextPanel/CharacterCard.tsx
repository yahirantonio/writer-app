'use client';

import React, { useState } from 'react';
import { useWriterStore, CharacterCard as CardType } from '@/stores/useWriterStore';
import { useFileSystem } from '@/hooks/useFileSystem';
import { useModalStore } from '@/stores/useModalStore';

export function CharacterCard() {
  const characterCards = useWriterStore((s) => s.characterCards);
  const { saveCharacter, deleteCharacter } = useFileSystem();
  const directoryHandle = useWriterStore((s) => s.directoryHandle);
  const openModal = useModalStore((s) => s.openModal);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string>('');

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [desc, setDesc] = useState('');

  const clearForm = () => {
    setName('');
    setRole('');
    setDesc('');
    setOriginalName('');
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (card: CardType) => {
    setEditingId(card.id);
    setOriginalName(card.name);
    setName(card.name);
    setRole(card.role);
    setDesc(card.description);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    const card: CardType = {
      id: editingId || crypto.randomUUID(),
      name: name.trim(),
      role: role.trim(),
      description: desc.trim(),
    };

    await saveCharacter(card, originalName);
    clearForm();
  };

  const handleDelete = async (card: CardType, e: React.MouseEvent) => {
    e.stopPropagation();
    openModal({
      type: 'confirm',
      title: 'Eliminar elemento',
      message: `¿Estás seguro de que quieres eliminar a "${card.name}"? Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      onConfirm: () => deleteCharacter(card),
    });
  };

  return (
    <div className="context-section">
      <div className="context-section-header">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Personajes
        </h3>
        {directoryHandle && (
          <button
            onClick={() => {
              if (isAdding || editingId) clearForm();
              else setIsAdding(true);
            }}
            className="sidebar-btn"
            title="Agregar personaje"
          >
            {isAdding || editingId ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* ── Add/Edit form ────────────────────────────────────────────────── */}
      {(isAdding || editingId) && (
        <div className="character-form animate-fade-in px-3 py-4 bg-zinc-800/20 rounded-xl border border-zinc-800/50 mb-4 mx-3">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="context-input font-medium"
            autoFocus
          />
          <input
            type="text"
            placeholder="Rol (ej: Protagonista)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="context-input text-xs"
          />
          <textarea
            placeholder="Descripción breve…"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="context-input resize-none text-xs"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button onClick={clearForm} className="flex-1 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
              Cancelar
            </button>
            <button onClick={handleSave} className="flex-1 context-add-btn py-1.5">
              {editingId ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </div>
      )}

      {/* ── Card list ───────────────────────────────────────────────────── */}
      <div className="space-y-2 px-3">
        {characterCards.length === 0 && !isAdding && !editingId && (
          <p className="text-zinc-600 text-[11px] text-center py-6">
            Sin personajes aún
          </p>
        )}
        {characterCards.map((card) => (
          <div
            key={card.id}
            className={`character-card group cursor-pointer border ${editingId === card.id ? 'border-violet-500/50 bg-violet-500/5' : 'border-transparent hover:border-zinc-800'}`}
            onClick={() => startEdit(card)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors truncate">
                  {card.name}
                </h4>
                {card.role && (
                  <span className="text-[10px] uppercase tracking-wider text-violet-400/80 font-semibold">
                    {card.role}
                  </span>
                )}
              </div>
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleDelete(card, e)}
                  className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                  title="Eliminar"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                </button>
              </div>
            </div>
            {card.description && (
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-3">
                {card.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
