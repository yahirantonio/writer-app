'use client';

import React from 'react';
import { CharacterCard } from './CharacterCard';
import { QuickNotes } from './QuickNotes';

export function ContextPanel() {
  return (
    <aside className="context-panel">
      <CharacterCard />
      {/* <QuickNotes /> */}
    </aside>
  );
}
