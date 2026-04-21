'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ORGAN_DATABASE, OrganData, View } from './organData';

// ── Colour constants ──────────────────────────────────────────────────────────
const C = {
  defaultFill:   '#c9b99a',
  defaultStroke: '#8b7355',
  hoverFill:     '#c97c2f',
  hoverStroke:   '#8a4e12',
  selectedFill:  '#9e3d22',
  selectedStroke:'#6b2210',
  unknown:       '#b0a898',
};

// ── Web-Audio helpers ─────────────────────────────────────────────────────────
let audioCtx: AudioContext | null = null;
function getAudio() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}
function tone(freq: number, dur: number, vol: number, detune = 0) {
  const ctx = getAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.frequency.value = freq;
  if (detune) osc.detune.value = detune;
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.start(); osc.stop(ctx.currentTime + dur);
}
function playHover()  { tone(1100, 0.08, 0.04); }
function playSelect() { tone(440, 0.22, 0.07); tone(660, 0.22, 0.04, 3); }
function playTab()    { tone(700, 0.06, 0.03); }

// ── Helpers ───────────────────────────────────────────────────────────────────
function applyStyle(el: Element, fill: string, stroke: string) {
  (el as HTMLElement).style.fill        = fill;
  (el as HTMLElement).style.stroke      = stroke;
  (el as HTMLElement).style.strokeWidth = '0.4';
  (el as HTMLElement).style.transition  = 'fill 0.15s, stroke 0.15s';
}

interface TooltipState { visible: boolean; x: number; y: number; label: string; }

const tabs = ['Overview', 'Function', 'Clinical', 'Related'] as const;
type Tab = typeof tabs[number];

interface Props { bodySvg: string; brainSvg: string; soundEnabled: boolean; }

export function AnatomyExplorer({ bodySvg, brainSvg, soundEnabled }: Props) {
  const [view, setView]           = useState<View>('body');
  const [selected, setSelected]   = useState<OrganData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [tooltip, setTooltip]     = useState<TooltipState>({ visible: false, x: 0, y: 0, label: '' });

  const bodyRef  = useRef<HTMLDivElement>(null);
  const brainRef = useRef<HTMLDivElement>(null);
  const hoveredId = useRef<string | null>(null);
  const selectedId = useRef<string | null>(null);

  // ── Initialise an SVG container after mount ──────────────────────────────
  const initSvg = useCallback((container: HTMLDivElement | null) => {
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg || svg.dataset.initialized === 'true') return;
    svg.dataset.initialized = 'true';

    // 1. Remove visibility restrictions from ALL elements in the SVG
    svg.removeAttribute('visibility');
    svg.style.visibility = 'visible';
    svg.style.overflow   = 'visible';
    svg.querySelectorAll('[visibility="hidden"]').forEach(el => el.removeAttribute('visibility'));
    svg.querySelectorAll('[style*="visibility:hidden"], [style*="visibility: hidden"]').forEach(el => {
      (el as HTMLElement).style.visibility = 'visible';
    });

    // 2. Disable pointer events for all background layers/outlines by default
    svg.querySelectorAll('*').forEach(el => {
      (el as HTMLElement).style.pointerEvents = 'none';
    });

    // 3. Strip inline none fills/strokes from all UBERON elements and their children so they inherit
    const allUberonElements = svg.querySelectorAll('[id^="UBERON"]');
    allUberonElements.forEach(uberon => {
      // Re-enable pointer events only for UBERON elements
      (uberon as HTMLElement).style.pointerEvents = 'all';
      
      const descendants = uberon.querySelectorAll('*');
      descendants.forEach(child => {
        const htmlChild = child as HTMLElement;
        htmlChild.style.pointerEvents = 'all';
        if (htmlChild.style.fill === 'none') htmlChild.style.fill = '';
        if (htmlChild.style.stroke === 'none') htmlChild.style.stroke = '';
        child.removeAttribute('fill');
        child.removeAttribute('stroke');
      });
    });

    // 4. Apply default warm fills to every UBERON element
    allUberonElements.forEach(el => {
      const id = el.id;
      const fill = ORGAN_DATABASE[id] ? C.defaultFill : C.unknown;
      applyStyle(el, fill, C.defaultStroke);
      el.setAttribute('cursor', 'pointer');
      
      // Ensure the UBERON element itself doesn't have an inline fill="none" attribute blocking inheritance
      el.removeAttribute('fill');
      el.removeAttribute('stroke');
    });

    // Wire events
    svg.addEventListener('mousemove', (e: Event) => {
      const me = e as MouseEvent;
      const target = (me.target as Element)?.closest('[id^="UBERON"]');
      if (!target) {
        setTooltip(t => ({ ...t, visible: false }));
        if (hoveredId.current && hoveredId.current !== selectedId.current) {
          const el = svg.querySelector(`#${hoveredId.current}`);
          if (el) applyStyle(el, C.defaultFill, C.defaultStroke);
        }
        hoveredId.current = null;
        return;
      }
      const id = target.id;
      if (id !== hoveredId.current) {
        // un-hover previous
        if (hoveredId.current && hoveredId.current !== selectedId.current) {
          const prev = svg.querySelector(`#${hoveredId.current}`);
          if (prev) applyStyle(prev, C.defaultFill, C.defaultStroke);
        }
        hoveredId.current = id;
        if (id !== selectedId.current) {
          applyStyle(target, C.hoverFill, C.hoverStroke);
          if (soundEnabled) playHover();
        }

        // Tooltip label: from SVG <title> or DB
        const title = target.querySelector('title')?.textContent || ORGAN_DATABASE[id]?.name || id;
        // Convert rect to tooltip position
        const rect = (container.parentElement || container).getBoundingClientRect();
        setTooltip({ visible: true, x: me.clientX - rect.left + 12, y: me.clientY - rect.top - 10, label: title });
      }
    });

    svg.addEventListener('mouseleave', () => {
      setTooltip(t => ({ ...t, visible: false }));
      if (hoveredId.current && hoveredId.current !== selectedId.current) {
        const el = svg.querySelector(`#${hoveredId.current}`);
        if (el) applyStyle(el, C.defaultFill, C.defaultStroke);
      }
      hoveredId.current = null;
    });

    svg.addEventListener('click', (e: Event) => {
      const me = e as MouseEvent;
      const target = (me.target as Element)?.closest('[id^="UBERON"]');
      if (!target) { return; }
      const id = target.id;
      // Un-select previous
      if (selectedId.current && selectedId.current !== id) {
        const prev = svg.querySelector(`#${selectedId.current}`);
        if (prev) applyStyle(prev, C.defaultFill, C.defaultStroke);
      }
      selectedId.current = id;
      applyStyle(target, C.selectedFill, C.selectedStroke);
      if (soundEnabled) playSelect();
      const data = ORGAN_DATABASE[id];
      setSelected(data || null);
      setActiveTab('Overview');
    });
  }, [soundEnabled]);

  // ── Re-init when view switches ───────────────────────────────────────────
  useEffect(() => {
    // Initialise both SVGs safely on mount to prevent double listeners
    const timer = setTimeout(() => {
      initSvg(bodyRef.current);
      initSvg(brainRef.current);
    }, 150);
    return () => clearTimeout(timer);
  }, [initSvg]);

  // ── Navigate to a related structure ─────────────────────────────────────
  const navigateTo = (id: string) => {
    const data = ORGAN_DATABASE[id];
    if (!data) return;
    if (data.view !== view) {
      setView(data.view);
      // Defer selection until SVG is reinitialised
      setTimeout(() => {
        const ref = data.view === 'body' ? bodyRef.current : brainRef.current;
        if (!ref) return;
        const svg = ref.querySelector('svg');
        if (!svg) return;
        if (selectedId.current) {
          const prev = svg.querySelector(`#${selectedId.current}`);
          if (prev) applyStyle(prev, C.defaultFill, C.defaultStroke);
        }
        const el = svg.querySelector(`#${id}`);
        if (el) applyStyle(el, C.selectedFill, C.selectedStroke);
        selectedId.current = id;
        setSelected(data);
        setActiveTab('Overview');
        if (soundEnabled) playSelect();
      }, 200);
    } else {
      const ref = view === 'body' ? bodyRef.current : brainRef.current;
      const svg = ref?.querySelector('svg');
      if (!svg) return;
      if (selectedId.current) {
        const prev = svg.querySelector(`#${selectedId.current}`);
        if (prev) applyStyle(prev, C.defaultFill, C.defaultStroke);
      }
      const el = svg.querySelector(`#${id}`);
      if (el) applyStyle(el, C.selectedFill, C.selectedStroke);
      selectedId.current = id;
      setSelected(data);
      setActiveTab('Overview');
      if (soundEnabled) playSelect();
    }
  };

  const switchTab = (t: Tab) => {
    setActiveTab(t);
    if (soundEnabled) playTab();
  };

  return (
    <div className="anatomy-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0', color: '#2c2016', fontFamily: '"IBM Plex Sans", system-ui, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2rem', fontWeight: 700, color: '#2c2016', margin: 0 }}>
          Anatomy Explorer
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#7a6f5e', marginTop: '0.25rem' }}>
          UBERON Ontology · {view === 'body' ? '76 structures' : '28 regions'} · Click a structure to view clinical data
        </p>
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>

        {/* ── Left: SVG Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          {/* View selector */}
          <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid #c4b49a' }}>
            {(['body', 'brain'] as View[]).map(v => (
              <button
                key={v}
                onClick={() => { setView(v); setSelected(null); selectedId.current = null; hoveredId.current = null; }}
                style={{
                  flex: 1, padding: '0.5rem', border: 'none', cursor: 'pointer',
                  background: view === v ? '#3d2b1a' : '#f5f0e8',
                  color: view === v ? '#f5f0e8' : '#5c4a35',
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  fontWeight: view === v ? 600 : 400,
                  fontSize: '0.85rem', textTransform: 'capitalize',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {v === 'body' ? '⬬ Body' : '◉ Brain'}
              </button>
            ))}
          </div>

          {/* SVG container with tooltip */}
          <div style={{ position: 'relative', flex: 1, background: '#faf8f3', borderRadius: '12px', border: '1px solid #d4c4a8', overflow: 'visible', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
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

            {/* Body SVG */}
            <div
              ref={bodyRef}
              style={{ display: view === 'body' ? 'flex' : 'none', justifyContent: 'center', width: '100%' }}
              dangerouslySetInnerHTML={{ __html: bodySvg.replace(/<svg/, `<svg style="max-height:580px;width:100%;height:auto;"`) }}
            />

            {/* Brain SVG */}
            <div
              ref={brainRef}
              style={{ display: view === 'brain' ? 'flex' : 'none', justifyContent: 'center', width: '100%' }}
              dangerouslySetInnerHTML={{ __html: brainSvg.replace(/<svg/, `<svg style="max-height:580px;width:100%;height:auto;"`) }}
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

        {/* ── Right: Info Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', background: '#faf8f3', borderRadius: '12px', border: '1px solid #d4c4a8', overflow: 'hidden' }}>

          {!selected ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e8dece', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontSize: '1.5rem' }}>
                ⬡
              </div>
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
                    color: '#f5f0e8', fontWeight: 500, textTransform: 'capitalize', alignSelf: 'flex-start'
                  }}>
                    {selected.view}
                  </span>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 0, marginTop: '0.75rem' }}>
                  {tabs.map(t => (
                    <button
                      key={t}
                      onClick={() => switchTab(t)}
                      style={{
                        padding: '0.45rem 1rem', border: 'none', cursor: 'pointer',
                        background: 'transparent',
                        borderBottom: activeTab === t ? '2px solid #9e3d22' : '2px solid transparent',
                        color: activeTab === t ? '#9e3d22' : '#7a6f5e',
                        fontFamily: '"IBM Plex Sans", sans-serif',
                        fontWeight: activeTab === t ? 600 : 400,
                        fontSize: '0.82rem', transition: 'color 0.15s, border-color 0.15s',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>

                {/* OVERVIEW */}
                {activeTab === 'Overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.88rem', lineHeight: 1.75, color: '#3a2e22', margin: 0 }}>
                      {selected.overview.description}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      {selected.overview.stats.map(s => (
                        <div key={s.label} style={{ background: '#f0ebe0', borderRadius: '8px', padding: '0.7rem 0.9rem', border: '1px solid #ddd0b8' }}>
                          <div style={{ fontSize: '0.68rem', color: '#8a7a66', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                            {s.label}
                          </div>
                          <div style={{ fontSize: '0.95rem', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, color: '#2c2016' }}>
                            {s.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FUNCTION */}
                {activeTab === 'Function' && (
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.85, color: '#3a2e22', margin: 0 }}>
                    {selected.function}
                  </p>
                )}

                {/* CLINICAL */}
                {activeTab === 'Clinical' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <p style={{ fontSize: '0.73rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8a7a66', margin: '0 0 0.5rem' }}>
                        Associated Conditions
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {selected.clinical.conditions.map(c => (
                          <span key={c} style={{
                            fontSize: '0.78rem', padding: '3px 10px', borderRadius: '20px',
                            border: '1px solid #c9a87a', background: '#f5ede0', color: '#6b4a1e'
                          }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{
                      background: '#fdf7ee', border: '1px solid #c9a87a',
                      borderLeft: '3px solid #8a4e12', borderRadius: '6px', padding: '1rem',
                    }}>
                      <p style={{ fontSize: '0.83rem', lineHeight: 1.8, color: '#3a2e22', margin: 0 }}>
                        {selected.clinical.note}
                      </p>
                    </div>
                  </div>
                )}

                {/* RELATED */}
                {activeTab === 'Related' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selected.related.length === 0 ? (
                      <p style={{ color: '#8a7a66', fontSize: '0.85rem' }}>No linked structures.</p>
                    ) : (
                      selected.related.map(id => {
                        const rel = ORGAN_DATABASE[id];
                        return (
                          <button
                            key={id}
                            onClick={() => navigateTo(id)}
                            style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #ddd0b8',
                              background: '#f5f0e8', cursor: 'pointer', textAlign: 'left', width: '100%',
                              transition: 'background 0.15s, border-color 0.15s',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#ede5d6'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#c9a87a'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f5f0e8'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#ddd0b8'; }}
                          >
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#3a2e22' }}>{rel?.name || id}</div>
                              <div style={{ fontSize: '0.7rem', fontFamily: '"IBM Plex Mono", monospace', color: '#8a7a66' }}>{id.replace('_', ':')}</div>
                            </div>
                            <div style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px',
                              background: rel?.view === 'body' ? '#3d2b1a' : '#1a2b3d', color: '#f5f0e8' }}>
                              {rel?.view || '—'}
                            </div>
                          </button>
                        );
                      })
                    )}
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
