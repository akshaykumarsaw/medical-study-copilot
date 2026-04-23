import { readFileSync } from 'fs';
import { join } from 'path';
import AnatomyPageClient from './client';

export const metadata = {
  title: 'Anatomy Explorer | Arivu',
  description: 'Interactive anatomy explorer with UBERON ontology, clinical data, and physiological functions.',
};

export default function AnatomyPage() {
  const svgDir = join(
    process.cwd(),
    'node_modules/@ebi-gene-expression-group/anatomogram/lib/svg'
  );

  // Strip the EBI licence anchor (the green © icon) before sending to the client
  const stripLicenceIcon = (svg: string) =>
    svg.replace(/<a[^>]*licence\.html[^>]*>[\s\S]*?<\/a>/gi, '');

  const bodySvg  = stripLicenceIcon(readFileSync(join(svgDir, 'homo_sapiens.male.svg'),  'utf8'));
  const brainSvg = stripLicenceIcon(readFileSync(join(svgDir, 'homo_sapiens.brain.svg'), 'utf8'));

  return (
    <div style={{ height: 'calc(100vh - 5rem)', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AnatomyPageClient bodySvg={bodySvg} brainSvg={brainSvg} />
    </div>
  );
}
