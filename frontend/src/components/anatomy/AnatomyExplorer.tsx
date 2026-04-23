'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ORGAN_DATABASE, OrganData, View } from './organData';

// ── Colour constants ───────────────────────────────────────────────────────────
const C = {
  defaultFill:   '#c9b99a',
  defaultStroke: '#8b7355',
  hoverFill:     '#c97c2f',
  hoverStroke:   '#8a4e12',
  selectedFill:  '#9e3d22',
  selectedStroke:'#6b2210',
  unknown:       '#b0a898',
};

// ── Apply fill/stroke to an SVG element ───────────────────────────────────────
function applyFill(el: Element, fill: string, stroke: string) {
  const s = (el as SVGElement).style;
  s.fill        = fill;
  s.stroke      = stroke;
  s.strokeWidth = '0.4';
  s.transition  = 'fill 0.15s, stroke 0.15s';
}

/**
 * Pure DOM-styling pass: overrides the EBI SVG default `fill:none;stroke:none`
 * on every UBERON group. NO event listeners attached here — all events use
 * React synthetic handlers on the container div.
 */
function initSvgStyles(svg: SVGSVGElement) {
  svg.querySelectorAll('[id^="UBERON"]').forEach(el => {
    const g = el as SVGElement;

    // Clear the entire inline style (which ships as "fill:none;stroke:none")
    g.style.cssText = '';
    g.removeAttribute('fill');
    g.removeAttribute('stroke');

    // Also clear any child paths that have fill:none
    el.querySelectorAll('path, ellipse, circle, rect, polygon').forEach(child => {
      const ch = child as SVGElement;
      const style = ch.getAttribute('style') || '';
      if (ch.style.fill === 'none' || style.includes('fill:none')) {
        ch.style.cssText = '';
      }
      if (ch.getAttribute('fill') === 'none') ch.removeAttribute('fill');
      if (ch.getAttribute('stroke') === 'none') ch.removeAttribute('stroke');
    });

    const isKnown = !!ORGAN_DATABASE[el.id];
    applyFill(el, isKnown ? C.defaultFill : C.unknown, isKnown ? C.defaultStroke : '#8a7a66');
    if (isKnown) g.style.cursor = 'pointer';
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface TooltipState { visible: boolean; x: number; y: number; label: string; }
const tabs = ['Overview', 'Function', 'Clinical', 'Related'] as const;
type Tab = typeof tabs[number];
interface Props { bodySvg: string; brainSvg: string; soundEnabled: boolean; }

// ── Component ─────────────────────────────────────────────────────────────────
export function AnatomyExplorer({ bodySvg, brainSvg }: Props) {
  const [view, setView]           = useState<View>('body');
  const [selected, setSelected]   = useState<OrganData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [tooltip, setTooltip]     = useState<TooltipState>({ visible: false, x: 0, y: 0, label: '' });

  const bodyRef    = useRef<HTMLDivElement>(null);
  const brainRef   = useRef<HTMLDivElement>(null);
  const hoveredId  = useRef<string | null>(null);
  const selectedId = useRef<string | null>(null);
  const initDone   = useRef({ body: false, brain: false });
  // Use a ref for view so event handlers don't go stale
  const viewRef    = useRef<View>('body');

  // Keep viewRef in sync
  useEffect(() => { viewRef.current = view; }, [view]);

  // Stable HTML strings — prevents React replacing the SVG DOM on every re-render
  const bodyHtml  = useMemo(() => bodySvg.replace(/<svg/, '<svg style="max-height:580px;width:100%;height:auto;"'), [bodySvg]);
  const brainHtml = useMemo(() => brainSvg.replace(/<svg/, '<svg style="max-height:580px;width:100%;height:auto;"'), [brainSvg]);

  // ── Style-only init (no events) ───────────────────────────────────────────
  useEffect(() => {
    const doInit = (container: HTMLDivElement | null, key: 'body' | 'brain') => {
      if (!container || initDone.current[key]) return;
      const svg = container.querySelector('svg') as SVGSVGElement | null;
      if (!svg) return;
      initDone.current[key] = true;
      initSvgStyles(svg);
    };
    const raf = requestAnimationFrame(() => {
      doInit(bodyRef.current, 'body');
      doInit(brainRef.current, 'brain');
    });
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helper: get the SVG for the currently active view ─────────────────────
  const getActiveSvg = useCallback((): SVGSVGElement | null => {
    const ref = viewRef.current === 'body' ? bodyRef.current : brainRef.current;
    return ref?.querySelector('svg') ?? null;
  }, []);

  // ── React synthetic event handlers ────────────────────────────────────────

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const svg = getActiveSvg();
    if (!svg) return;

    const uberonEl = (e.target as Element).closest('[id^="UBERON"]');

    // No UBERON target or unknown organ → hide tooltip, un-hover previous
    if (!uberonEl || !ORGAN_DATABASE[uberonEl.id]) {
      if (tooltip.visible) setTooltip(t => ({ ...t, visible: false }));
      if (hoveredId.current && hoveredId.current !== selectedId.current) {
        const prev = svg.querySelector('#' + CSS.escape(hoveredId.current));
        if (prev) applyFill(prev, C.defaultFill, C.defaultStroke);
      }
      hoveredId.current = null;
      return;
    }

    const id = uberonEl.id;

    // Same organ — just update tooltip coords
    if (id === hoveredId.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip(t => ({ ...t, x: e.clientX - rect.left + 14, y: e.clientY - rect.top - 8 }));
      return;
    }

    // Un-hover previous
    if (hoveredId.current && hoveredId.current !== selectedId.current) {
      const prev = svg.querySelector('#' + CSS.escape(hoveredId.current));
      if (prev) applyFill(prev, C.defaultFill, C.defaultStroke);
    }

    hoveredId.current = id;
    if (id !== selectedId.current) applyFill(uberonEl, C.hoverFill, C.hoverStroke);

    const label = uberonEl.querySelector('title')?.textContent?.trim()
      || ORGAN_DATABASE[id]?.name || id;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ visible: true, x: e.clientX - rect.left + 14, y: e.clientY - rect.top - 8, label });
  }, [getActiveSvg, tooltip.visible]);

  const handleMouseLeave = useCallback(() => {
    const svg = getActiveSvg();
    setTooltip(t => ({ ...t, visible: false }));
    if (svg && hoveredId.current && hoveredId.current !== selectedId.current) {
      const prev = svg.querySelector('#' + CSS.escape(hoveredId.current));
      if (prev) applyFill(prev, C.defaultFill, C.defaultStroke);
    }
    hoveredId.current = null;
  }, [getActiveSvg]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const svg = getActiveSvg();
    if (!svg) return;

    const uberonEl = (e.target as Element).closest('[id^="UBERON"]');
    if (!uberonEl) return;

    const id = uberonEl.id;
    const data = ORGAN_DATABASE[id];
    if (!data) return; // Not a known organ — ignore

    // Un-select previous
    if (selectedId.current && selectedId.current !== id) {
      const prev = svg.querySelector('#' + CSS.escape(selectedId.current));
      if (prev) applyFill(prev, C.defaultFill, C.defaultStroke);
    }

    selectedId.current = id;
    applyFill(uberonEl, C.selectedFill, C.selectedStroke);

    // These React state updates WILL trigger a re-render correctly
    setSelected(data);
    setActiveTab('Overview');
  }, [getActiveSvg]);

  // ── Switch view (tab button) ──────────────────────────────────────────────
  const switchView = useCallback((v: View) => {
    // Un-highlight any selected element in the current view
    const currentSvg = getActiveSvg();
    if (currentSvg && selectedId.current) {
      const prev = currentSvg.querySelector('#' + CSS.escape(selectedId.current));
      if (prev) applyFill(prev, C.defaultFill, C.defaultStroke);
    }
    hoveredId.current  = null;
    selectedId.current = null;
    setView(v);
    setSelected(null);
    setActiveTab('Overview');
    setTooltip(t => ({ ...t, visible: false }));
  }, [getActiveSvg]);

  // ── Navigate to a related structure ──────────────────────────────────────
  const navigateTo = useCallback((id: string) => {
    const data = ORGAN_DATABASE[id];
    if (!data) return;

    const doSelect = () => {
      const ref = data.view === 'body' ? bodyRef.current : brainRef.current;
      const svg = ref?.querySelector('svg') as SVGSVGElement | null;
      if (!svg) return;
      if (selectedId.current) {
        const prev = svg.querySelector('#' + CSS.escape(selectedId.current));
        if (prev) applyFill(prev, C.defaultFill, C.defaultStroke);
      }
      const el = svg.querySelector('#' + CSS.escape(id));
      if (el) applyFill(el, C.selectedFill, C.selectedStroke);
      selectedId.current = id;
      setSelected(data);
      setActiveTab('Overview');
    };

    if (data.view !== viewRef.current) {
      setView(data.view);
      setTimeout(doSelect, 50);
    } else {
      doSelect();
    }
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: '#2c2016', fontFamily: '"IBM Plex Sans", system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2rem', fontWeight: 700, color: '#2c2016', margin: 0 }}>
          Anatomy Explorer
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#7a6f5e', marginTop: '0.25rem' }}>
          UBERON Ontology · {view === 'body' ? '76 structures' : '28 regions'} · Click a structure to view clinical data
        </p>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>

        {/* Left: SVG panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          {/* View switcher */}
          <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid #c4b49a' }}>
            {(['body', 'brain'] as View[]).map(v => (
              <button key={v} onClick={() => switchView(v)} style={{
                flex: 1, padding: '0.5rem', border: 'none', cursor: 'pointer',
                background: view === v ? '#3d2b1a' : '#f5f0e8',
                color: view === v ? '#f5f0e8' : '#5c4a35',
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontWeight: view === v ? 600 : 400,
                fontSize: '0.85rem', textTransform: 'capitalize',
                transition: 'background 0.2s, color 0.2s',
              }}>
                {v === 'body' ? '⬬ Body' : '◉ Brain'}
              </button>
            ))}
          </div>

          {/* SVG container — events live HERE (React synthetic) */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{
              position: 'relative', flex: 1, background: '#faf8f3',
              borderRadius: '12px', border: '1px solid #d4c4a8',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              padding: '1rem', cursor: 'default', overflow: 'hidden',
            }}
          >
            {/* Floating tooltip */}
            {tooltip.visible && (
              <div style={{
                position: 'absolute', left: tooltip.x, top: tooltip.y, zIndex: 50,
                background: '#2c2016', color: '#f5f0e8', padding: '4px 10px',
                borderRadius: '6px', fontSize: '0.78rem', pointerEvents: 'none',
                fontFamily: '"IBM Plex Sans", sans-serif', whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}>
                {tooltip.label}
              </div>
            )}

            {/* Body SVG — always mounted, shown/hidden via display */}
            <div
              ref={bodyRef}
              style={{ display: view === 'body' ? 'flex' : 'none', justifyContent: 'center', width: '100%' }}
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            {/* Brain SVG — always mounted, shown/hidden via display */}
            <div
              ref={brainRef}
              style={{ display: view === 'brain' ? 'flex' : 'none', justifyContent: 'center', width: '100%' }}
              dangerouslySetInnerHTML={{ __html: brainHtml }}
            />
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: '#7a6f5e', paddingLeft: '0.5rem' }}>
            {[['#c9b99a', 'Structure'], ['#c97c2f', 'Hover'], ['#9e3d22', 'Selected']].map(([c, l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />{l}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Info panel */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#faf8f3', borderRadius: '12px', border: '1px solid #d4c4a8', overflow: 'hidden' }}>
          {!selected ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e8dece', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontSize: '1.5rem' }}>⬡</div>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', fontWeight: 600, color: '#5c4a35', marginBottom: '0.5rem' }}>
                Select a Structure
              </p>
              <p style={{ fontSize: '0.82rem', color: '#9a8c78', lineHeight: 1.6, maxWidth: 260 }}>
                Hover over any highlighted region on the anatomical diagram, then click to view detailed clinical information.
              </p>
            </div>
          ) : (
            <>
              {/* Panel header */}
              <div style={{ padding: '1.25rem 1.5rem 0', borderBottom: '1px solid #e8dece' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <div>
                    <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.7rem', fontWeight: 700, color: '#2c2016', margin: 0 }}>
                      {selected.name}
                    </h2>
                    <p style={{ fontSize: '0.72rem', fontFamily: '"IBM Plex Mono", monospace', color: '#8a7a66', margin: '2px 0 0' }}>
                      {selected.id.replace('_', ':')}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '0.7rem', padding: '3px 10px', borderRadius: '20px',
                    background: selected.view === 'body' ? '#3d2b1a' : '#1a2b3d',
                    color: '#f5f0e8', fontWeight: 500, textTransform: 'capitalize', alignSelf: 'flex-start',
                  }}>
                    {selected.view}
                  </span>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', marginTop: '0.75rem' }}>
                  {tabs.map(t => (
                    <button key={t} onClick={() => setActiveTab(t)} style={{
                      padding: '0.45rem 1rem', border: 'none', cursor: 'pointer', background: 'transparent',
                      borderBottom: activeTab === t ? '2px solid #9e3d22' : '2px solid transparent',
                      color: activeTab === t ? '#9e3d22' : '#7a6f5e',
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      fontWeight: activeTab === t ? 600 : 400,
                      fontSize: '0.82rem', transition: 'color 0.15s, border-color 0.15s',
                    }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>

                {activeTab === 'Overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.88rem', lineHeight: 1.75, color: '#3a2e22', margin: 0 }}>
                      {selected.overview.description}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      {selected.overview.stats.map(s => (
                        <div key={s.label} style={{ background: '#f0ebe0', borderRadius: '8px', padding: '0.7rem 0.9rem', border: '1px solid #ddd0b8' }}>
                          <div style={{ fontSize: '0.68rem', color: '#8a7a66', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{s.label}</div>
                          <div style={{ fontSize: '0.95rem', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, color: '#2c2016' }}>{s.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'Function' && (
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.85, color: '#3a2e22', margin: 0 }}>
                    {selected.function}
                  </p>
                )}

                {activeTab === 'Clinical' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <p style={{ fontSize: '0.73rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a7a66', margin: '0 0 0.5rem' }}>Associated Conditions</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {selected.clinical.conditions.map(c => (
                          <span key={c} style={{ fontSize: '0.78rem', padding: '3px 10px', borderRadius: '20px', border: '1px solid #c9a87a', background: '#f5ede0', color: '#6b4a1e' }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: '#fdf7ee', border: '1px solid #c9a87a', borderLeft: '3px solid #8a4e12', borderRadius: '6px', padding: '1rem' }}>
                      <p style={{ fontSize: '0.83rem', lineHeight: 1.8, color: '#3a2e22', margin: 0 }}>{selected.clinical.note}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'Related' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selected.related.length === 0 ? (
                      <p style={{ color: '#8a7a66', fontSize: '0.85rem' }}>No linked structures.</p>
                    ) : selected.related.map(id => {
                      const rel = ORGAN_DATABASE[id];
                      return (
                        <button key={id} onClick={() => navigateTo(id)} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #ddd0b8',
                          background: '#f5f0e8', cursor: 'pointer', textAlign: 'left', width: '100%',
                          transition: 'background 0.15s, border-color 0.15s',
                        }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#ede5d6'; (e.currentTarget as HTMLElement).style.borderColor = '#c9a87a'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f5f0e8'; (e.currentTarget as HTMLElement).style.borderColor = '#ddd0b8'; }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#3a2e22' }}>{rel?.name || id}</div>
                            <div style={{ fontSize: '0.7rem', fontFamily: '"IBM Plex Mono", monospace', color: '#8a7a66' }}>{id.replace('_', ':')}</div>
                          </div>
                          <div style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: rel?.view === 'body' ? '#3d2b1a' : '#1a2b3d', color: '#f5f0e8' }}>
                            {rel?.view || '—'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
