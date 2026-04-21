import { readFileSync } from 'fs';
import { join } from 'path';
import AnatomyPageClient from './client';

export const metadata = {
  title: 'Anatomy Explorer | ARIVU',
  description: 'Interactive anatomy explorer with UBERON ontology, clinical data, and physiological functions.',
};

export default function AnatomyPage() {
  const svgDir = join(
    process.cwd(),
    'node_modules/@ebi-gene-expression-group/anatomogram/lib/svg'
  );

  const bodySvg  = readFileSync(join(svgDir, 'homo_sapiens.male.svg'),  'utf8');
  const brainSvg = readFileSync(join(svgDir, 'homo_sapiens.brain.svg'), 'utf8');

  return (
    <div style={{ height: 'calc(100vh - 5rem)', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AnatomyPageClient bodySvg={bodySvg} brainSvg={brainSvg} />
    </div>
  );
}
