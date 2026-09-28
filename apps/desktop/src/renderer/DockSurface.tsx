import React, { useEffect, useState } from 'react';
import { Check, ExternalLink, Mountain, Pause, Play } from 'lucide-react';
import type { DockState } from '../shared/types';
import './dock-surface.css';

export function DockSurface() {
  const [state, setState] = useState<DockState | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void window.aodDesktop.getDockState().then(setState);
    const offDock = window.aodDesktop.onDockStateChanged(setState);
    const offMove = window.aodDesktop.onRepositionStateChanged(setState);
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') void window.aodDesktop.cancelReposition(); };
    window.addEventListener('keydown', key);
    return () => { offDock(); offMove(); window.removeEventListener('keydown', key); };
  }, []);

  const content = state?.content;
  if (!state || !content) return <div className="dock-loading">Loading dock…</div>;

  function toggle(optionId: string) {
    if (submitted) return;
    if (!content?.multiple) setSelected([optionId]);
    else setSelected(values => values.includes(optionId) ? values.filter(id => id !== optionId) : [...values, optionId]);
  }

  async function submit() {
    if (!content?.promptId || selected.length === 0) return;
    try {
      await window.aodDesktop.submitResponse({ promptId: content.promptId, selectedOptionIds: selected });
      setSubmitted(true);
      setMessage('Answer saved on this PC');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save this answer.');
    }
  }

  return <main className={`native-dock ${state.repositioning ? 'is-repositioning' : ''}`}>
    {state.repositioning && <div className="move-banner">Drag to move · Save or cancel in Ads on Demand</div>}
    <div className="dock-sponsor"><span className="sponsor-dot"/>{content.sponsoredLabel}<span>{content.advertiser}</span></div>
    {content.format === 'image' && <div className="dock-layout image-layout">
      <div className="dock-visual trail"><Mountain size={44}/><span>OUTDOORS</span></div>
      <div className="dock-message"><h1>{content.title}</h1><p>{content.body}</p><button onClick={() => content.ctaUrl && window.aodDesktop.openExternal(content.ctaUrl)}>{content.ctaLabel}<ExternalLink size={13}/></button></div>
    </div>}
    {content.format === 'video' && <div className="dock-layout video-layout">
      <button className={`video-frame ${playing ? 'playing' : ''}`} aria-label={playing ? 'Pause example video' : 'Play example video'} onClick={() => setPlaying(value => !value)}>{playing ? <Pause/> : <Play/>}<span>{playing ? 'Playing local preview' : 'Play video preview'}</span></button>
      <div className="dock-message"><h1>{content.title}</h1><p>{content.body}</p><button onClick={() => content.ctaUrl && window.aodDesktop.openExternal(content.ctaUrl)}>{content.ctaLabel}<ExternalLink size={13}/></button></div>
    </div>}
    {(content.format === 'question' || content.format === 'survey') && <div className="response-layout">
      <h1>{content.title}</h1>
      <div className="answer-grid">{content.options?.map(option => <button key={option.id} className={selected.includes(option.id) ? 'selected' : ''} aria-pressed={selected.includes(option.id)} onClick={() => toggle(option.id)}><span>{selected.includes(option.id) && <Check size={13}/>}</span>{option.label}</button>)}</div>
      <div className="response-footer"><small>{message || (content.multiple ? 'Choose one or more' : 'Choose one')}</small><button className="submit-answer" disabled={selected.length === 0 || submitted} onClick={() => void submit()}>{submitted ? 'Saved' : 'Submit'}</button></div>
    </div>}
  </main>;
}

