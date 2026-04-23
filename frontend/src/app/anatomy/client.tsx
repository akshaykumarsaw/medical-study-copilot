'use client';

import React, { useState } from 'react';
import { AnatomyExplorer } from '@/components/anatomy/AnatomyExplorer';

export default function AnatomyPageClient({ bodySvg, brainSvg }: { bodySvg: string; brainSvg: string }) {
  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
       <AnatomyExplorer bodySvg={bodySvg} brainSvg={brainSvg} soundEnabled={false} />
    </div>
  );
}
