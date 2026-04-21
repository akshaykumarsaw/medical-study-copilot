'use client';

import React, { useState } from 'react';
import { AnatomyExplorer } from '@/components/anatomy/AnatomyExplorer';

export default function AnatomyPageClient({ bodySvg, brainSvg }: { bodySvg: string; brainSvg: string }) {
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AnatomyExplorer bodySvg={bodySvg} brainSvg={brainSvg} soundEnabled={soundEnabled} />

      {/* Sound toggle — bottom right */}
      <button
        onClick={() => setSoundEnabled(s => !s)}
        title={soundEnabled ? 'Mute sound feedback' : 'Enable sound feedback'}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 100,
          width: 40, height: 40, borderRadius: '50%', border: '1px solid #c4b49a',
          background: soundEnabled ? '#3d2b1a' : '#f5f0e8',
          color: soundEnabled ? '#f5f0e8' : '#5c4a35',
          cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        {soundEnabled ? '♪' : '♩'}
      </button>
    </div>
  );
}
