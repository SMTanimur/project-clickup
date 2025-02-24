'use client';

import { Sidebar } from './Sidebar';
import { CommandPalette } from '@/components/CommandPalette';
import { useEffect, useState } from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className='flex h-screen bg-background'>
      <Sidebar />
      <main className='flex-1 overflow-auto'>
        <div className='container mx-auto p-6'>{children}</div>
      </main>
      {showCommandPalette && (
        <CommandPalette onClose={() => setShowCommandPalette(false)} />
      )}
    </div>
  );
}
