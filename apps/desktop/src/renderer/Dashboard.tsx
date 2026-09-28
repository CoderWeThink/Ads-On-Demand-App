import React, { useEffect, useRef, useState } from 'react';
import {
  Activity as ActivityIcon, ArrowRight, BarChart3, Check, ChevronDown, CircleHelp, ExternalLink, Film, Grip,
  House, Image as ImageIcon, ListTree, LogOut, MessageCircleQuestion, Monitor, PanelLeftClose, Play,
  Settings2, SlidersHorizontal, SquareMousePointer, Trash2, UserRound, X,
} from 'lucide-react';
import logo from './approved-dark-wordmark.png';
import type { ActivityEvent, AppSettings, ConnectedDisplay, DockConfiguration, DockFormat, DockPlacement, DockPreset, DockState, LocalResponse } from '../shared/types';
import './dashboard.css';
import './dashboard-app.css';

const pages = ['Home', 'Docks', 'Earnings', 'Activity', 'Profile', 'Settings', 'Help'] as const;
const navIcons = [House, SquareMousePointer, BarChart3, ListTree, UserRound, Settings2, CircleHelp];
type Page = typeof pages[number];
const formatInfo: Record<DockFormat, { label: string; description: string; icon: typeof ImageIcon }> = {
  image: { label: 'Image Dock', description: 'A clean visual offer with one focused action.', icon: ImageIcon },
  video: { label: 'Video Dock', description: 'A lightweight local video-format preview.', icon: Film },
  question: { label: 'Quick Question', description: 'A short question with predefined answers.', icon: MessageCircleQuestion },
  survey: { label: 'Survey Dock', description: 'A compact multi-choice sponsored survey.', icon: SlidersHorizontal },
};
const presetLabels: Record<DockPreset, string> = {
  'top-left': 'Top left', 'top-right': 'Top right', 'bottom-left': 'Bottom left', 'bottom-right': 'Bottom right',
  'left-edge': 'Left edge', 'right-edge': 'Right edge', custom: 'Custom position',
};

function Chart() {
  const [range, setRange] = useState('30D');
  const [hover, setHover] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    if (box.current) observer.observe(box.current);
    return () => observer.disconnect();
  }, []);
  const left = 57, right = 18, base = 151, end = Math.max(left + 40, width - right);
  const days = range === '7D' ? 7 : range === '30D' ? 30 : range === '90D' ? 90 : 1;
  const date = (fraction: number) => {
    const value = new Date();
    value.setDate(value.getDate() - Math.round((1 - fraction) * (days - 1)));
    return value.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  return <section className="panel chart-panel"><div className="chart-head"><div className="chart-title"><h2>Earnings</h2><p>{range === 'All' ? 'All time' : `Last ${days} days`} · $0.00</p></div><div className="range-group" role="group" aria-label="Chart range">{['7D', '30D', '90D', 'All'].map(value => <button key={value} className={`range-button ${value === range ? 'is-active' : ''}`} aria-pressed={value === range} onClick={() => { setRange(value); setHover(null); }}>{value}</button>)}</div></div><div ref={box} className="chart-wrap"><svg className="chart" viewBox={`0 0 ${width} 190`} role="img" aria-label="Earnings in US dollars, currently zero"><title>Earnings in USD</title>{[0.03, 0.02, 0.01, 0].map((number, index) => <g key={number}><line className="grid" x1={left} x2={end} y1={16 + index * 45} y2={16 + index * 45}/><text x={left - 10} y={20 + index * 45} textAnchor="end">${number.toFixed(2)}</text></g>)}<path className="line" d={`M${left} ${base}H${end}`}/>{[0, .5, 1].map(fraction => <text key={fraction} x={left + (end - left) * fraction} y={181} textAnchor={fraction === 0 ? 'start' : fraction === 1 ? 'end' : 'middle'}>{range === 'All' ? (fraction === 0 ? 'Start' : fraction === 1 ? 'Today' : '') : date(fraction)}</text>)}{hover !== null && <g><line className="guide" x1={left + (end - left) * hover} x2={left + (end - left) * hover} y1={16} y2={base}/><circle className="point" cx={left + (end - left) * hover} cy={base} r={4}/></g>}<rect className="chart-hit" x={left} y={16} width={end - left} height={135} onPointerMove={event => { const rect = event.currentTarget.ownerSVGElement!.getBoundingClientRect(); setHover(Math.max(0, Math.min(1, ((event.clientX - rect.left) * width / rect.width - left) / (end - left)))); }} onPointerLeave={() => setHover(null)}/></svg>{hover !== null && <div className="chart-tooltip" style={{ left: Math.max(60, Math.min(width - 60, left + (end - left) * hover)), top: 140 }}><span>{date(hover)}</span><strong>$0.00</strong></div>}</div></section>;
}
function DockPreview({ format, compact = false }: { format: DockFormat; compact?: boolean }) {
  const info = formatInfo[format];
  const Icon = info.icon;
  return <div className={`product-dock-preview is-${format} ${compact ? 'compact' : ''}`}>
    <div className="preview-sponsored">Sponsored <span>Example campaign</span></div>
    {format === 'image' && <><div className="preview-art"><Icon size={compact ? 28 : 40}/></div><div className="preview-copy"><strong>Find your next trail.</strong><span>Explore the outdoors.</span><button>Explore <ExternalLink size={11}/></button></div></>}
    {format === 'video' && <><div className="preview-art video"><Play size={compact ? 25 : 34}/></div><div className="preview-copy"><strong>A new perspective.</strong><span>Video-format preview.</span><button>Learn more</button></div></>}
    {format === 'question' && <div className="preview-question"><strong>What's your next adventure?</strong><span><i/>Mountains</span><span><i/>Beaches</span></div>}
    {format === 'survey' && <div className="preview-question survey"><strong>Which topics interest you?</strong><span><i/>Technology</span><span><i/>Gaming</span><span><i/>Outdoors</span></div>}
  </div>;
}

function useDesktopData() {
  const [dock, setDock] = useState<DockState | null>(null);
  const [formats, setFormats] = useState<DockConfiguration[]>([]);
  const [displays, setDisplays] = useState<ConnectedDisplay[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [responses, setResponses] = useState<LocalResponse[]>([]);
  const refreshResponses = () => window.aodDesktop.getResponseHistory().then(setResponses);
  useEffect(() => {
    void Promise.all([
      window.aodDesktop.getDockState().then(setDock), window.aodDesktop.listDockFormats().then(setFormats),
      window.aodDesktop.getDisplays().then(setDisplays), window.aodDesktop.getSettings().then(setSettings),
      window.aodDesktop.getActivity().then(setActivity), refreshResponses(),
    ]);
    const offDock = window.aodDesktop.onDockStateChanged(setDock);
    const offMove = window.aodDesktop.onRepositionStateChanged(setDock);
    const offSettings = window.aodDesktop.onSettingsChanged(setSettings);
    const offActivity = window.aodDesktop.onActivityChanged(value => { setActivity(value); void refreshResponses(); });
    return () => { offDock(); offMove(); offSettings(); offActivity(); };
  }, []);
  return { dock, formats, displays, settings, activity, responses, setSettings, refreshResponses };
}

function HomePage({ dock, goToDocks, goToEarnings }: { dock: DockState; goToDocks: () => void; goToEarnings: () => void }) {
  return <><section className="home-intro"><h1>Welcome back.</h1><p>See your earnings and manage what is running on your desktop.</p></section><div className="overview"><section className="panel balance-panel"><div className="panel-label">Available earnings</div><div className="balance-row"><div className="balance-number">$0.00</div><div className="today">Earned today<strong>$0.00</strong></div></div><div className="balance-note">Only verified earnings will be shown here.</div><button className="primary-button" onClick={goToEarnings}>View analytics <ArrowRight size={16}/></button></section><section className="panel docks-panel"><div className="panel-heading"><div><h2>Dock status</h2><p>This PC · {dock.placement.preset === 'custom' ? 'Custom position' : presetLabels[dock.placement.preset]}</p></div><span className={`status ${dock.status}`}>{dock.status === 'running' ? 'Running' : 'Stopped'}</span></div><div className="desktop-preview">{dock.activeFormat ? <DockPreview format={dock.activeFormat} compact/> : <div className="no-dock">No dock running</div>}</div><div className="dock-footer"><button className="secondary-button" onClick={goToDocks}>Manage docks <ArrowRight size={16}/></button><span className="coming-soon">One dock can run at a time</span></div></section><Chart/></div></>;
}

function DocksPage({ dock, formats, displays }: { dock: DockState; formats: DockConfiguration[]; displays: ConnectedDisplay[] }) {
  const formatAnchor = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState(dock.activeConfigurationId ?? 'image');
  const selected = formats.find(item => item.id === selectedId) ?? formats[0];
  const [placement, setPlacement] = useState<DockPlacement>(dock.placement);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    if (dock.activeConfigurationId) setSelectedId(dock.activeConfigurationId);
    setPlacement(dock.placement);
  }, [dock.activeConfigurationId, dock.placement.displayId, dock.placement.preset, dock.placement.scale]);
  async function action(work: () => Promise<unknown>) {
    setBusy(true); setNotice('');
    try { await work(); } catch (error) { setNotice(error instanceof Error ? error.message : 'That action could not be completed.'); }
    finally { setBusy(false); }
  }
  if (!selected) return <section className="home-intro"><h1>Docks</h1><p>Loading dock formats…</p></section>;
  return <><section className="home-intro docks-intro"><div><h1>Docks</h1><p>Choose what appears on your desktop and where it belongs.</p></div><span className="one-dock-note"><span/>One dock can run at a time</span></section>
    <section className="panel dock-control-panel"><div className="dock-status-head"><div><h2>Dock status</h2><p>{displays.find(display => display.id === dock.placement.displayId)?.label ?? 'This PC · Primary display'}</p></div><span className={`status ${dock.status}`}>{dock.status === 'running' ? 'Running' : 'Stopped'}</span></div>
      <div className={`large-desktop-preview preview-${placement.preset}`}><div className="desktop-wallpaper"><span/><span/><span/></div><div className="preview-taskbar"><i/><i/><i/></div><div className="positioned-preview"><DockPreview format={(dock.activeFormat ?? selected.format)} compact/></div></div>
      <div className="dock-main-actions">
        {dock.status === 'stopped' ? <button className="primary-button" disabled={busy} onClick={() => void action(() => window.aodDesktop.startDock(selected.id))}><Play size={16}/>Start {selected.name}</button> : <button className="secondary-button" onClick={() => formatAnchor.current?.scrollIntoView({ behavior: 'smooth' })}><SlidersHorizontal size={16}/>Manage dock</button>}
        {!dock.repositioning && <button className="secondary-button" disabled={dock.status === 'stopped' || busy} onClick={() => void action(() => window.aodDesktop.beginReposition())}><Grip size={16}/>Reposition</button>}
        {dock.repositioning && <><button className="primary-button" disabled={busy} onClick={() => void action(() => window.aodDesktop.commitReposition())}><Check size={16}/>Save position</button><button className="secondary-button" disabled={busy} onClick={() => void action(() => window.aodDesktop.cancelReposition())}>Cancel</button></>}
        <button className="close-button" disabled={dock.status === 'stopped' || busy} onClick={() => void action(() => window.aodDesktop.closeDock())}><X size={16}/>Close dock</button>
      </div>{notice && <p className="inline-notice" role="status">{notice}</p>}
    </section>
    <section ref={formatAnchor} className="panel format-panel"><div className="format-heading"><div><h2>Choose a dock format</h2><p>Starting another format automatically closes the current dock.</p></div><span>{selected.name}</span></div><div className="format-grid">{formats.map(configuration => { const info = formatInfo[configuration.format]; const Icon = info.icon; const isSelected = selectedId === configuration.id; const isRunning = dock.activeConfigurationId === configuration.id; return <button key={configuration.id} className={`format-card ${isSelected ? 'selected' : ''}`} onClick={() => setSelectedId(configuration.id)}><span className="format-icon"><Icon size={22}/></span><span className="format-copy"><strong>{info.label}</strong><small>{info.description}</small></span>{isRunning ? <em>Running</em> : isSelected ? <Check size={17}/> : null}</button>; })}</div>
      <div className="format-footer"><div className="placement-controls"><label>Display<select value={placement.displayId} onChange={event => setPlacement(value => ({ ...value, displayId: event.target.value }))}>{displays.map(display => <option key={display.id} value={display.id}>{display.label}</option>)}</select><ChevronDown size={14}/></label><label>Dock placement<select value={placement.preset} onChange={event => setPlacement(value => ({ ...value, preset: event.target.value as DockPreset }))}>{Object.entries(presetLabels).filter(([value]) => value !== 'custom').map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown size={14}/></label><label className="scale-control">Dock scale <span>{Math.round(placement.scale * 100)}%</span><input type="range" min="0.75" max="1.25" step="0.05" value={placement.scale} onChange={event => setPlacement(value => ({ ...value, scale: Number(event.target.value) }))}/></label></div><div className="apply-actions">{dock.status === 'running' && <button className="secondary-button" disabled={busy} onClick={() => void action(() => window.aodDesktop.previewPlacement(placement))}>Preview position</button>}<button className="primary-button" disabled={dock.status === 'stopped' || busy} onClick={() => void action(() => window.aodDesktop.applyPlacement(placement))}>Apply placement</button>{dock.activeConfigurationId !== selected.id && <button className="primary-button" disabled={busy} onClick={() => void action(() => window.aodDesktop.startDock(selected.id))}>Start {selected.name}</button>}</div></div>
    </section></>;
}

function ActivityPage({ events }: { events: ActivityEvent[] }) {
  return <><section className="home-intro"><h1>Activity</h1><p>Dock changes and locally saved interactions from this PC.</p></section><section className="panel activity-panel">{events.length ? <ul className="event-list">{events.map(event => <li key={event.id}><span className={`event-icon event-${event.kind}`}><ActivityIcon size={16}/></span><div><strong>{event.message}</strong><time>{new Date(event.createdAt).toLocaleString()}</time></div></li>)}</ul> : <div className="empty-state"><ActivityIcon size={28}/><strong>No activity yet</strong><p>Start or reposition a dock and the event will appear here.</p></div>}</section></>;
}

function SettingsPage({ settings, responses, onSettings }: { settings: AppSettings; responses: LocalResponse[]; onSettings: (value: AppSettings) => void }) {
  const [confirmClear, setConfirmClear] = useState(false);
  async function update(key: keyof AppSettings, value: boolean) { onSettings(await window.aodDesktop.updateSettings({ [key]: value })); }
  async function clear() { await window.aodDesktop.clearResponseHistory(); setConfirmClear(false); }
  return <><section className="home-intro"><h1>Settings</h1><p>Control how Ads on Demand behaves on this PC.</p></section><div className="settings-grid"><section className="panel settings-panel"><div className="settings-title"><h2>Background behavior</h2><p>Your dashboard remains a normal Windows application.</p></div><SettingToggle title="Keep an active dock running" description="When a dock is active, closing the dashboard can hide it to the tray. With no active dock, closing the dashboard always quits the app." checked={settings.continueInBackground} onChange={value => void update('continueInBackground', value)}/><SettingToggle title="Launch at Windows sign-in" description="Start Ads on Demand after you sign in to Windows. Off by default." checked={settings.launchAtLogin} onChange={value => void update('launchAtLogin', value)}/><SettingToggle title="Restore my last running dock" description="Open your previous dock when Ads on Demand starts. Off by default." checked={settings.restoreLastDock} onChange={value => void update('restoreLastDock', value)}/></section><section className="panel settings-panel"><div className="settings-title"><h2>Local response history</h2><p>Prototype answers stay encrypted on this PC and are not uploaded.</p></div><div className="response-summary"><strong>{responses.length}</strong><span>saved {responses.length === 1 ? 'response' : 'responses'}</span></div>{responses.slice(0, 3).map(response => <div className="response-row" key={response.id}><div><strong>{response.prompt}</strong><span>{response.selectedLabels.join(', ')}</span></div><time>{new Date(response.submittedAt).toLocaleDateString()}</time></div>)}<button className="danger-button" disabled={!responses.length} onClick={() => setConfirmClear(true)}><Trash2 size={16}/>Delete response history</button></section><section className="panel settings-panel quit-panel"><div className="settings-title"><h2>Quit Ads on Demand</h2><p>This closes the dashboard, system tray, and any running dock.</p></div><button className="close-button" onClick={() => void window.aodDesktop.quitApplication()}><LogOut size={16}/>Quit application</button></section></div>{confirmClear && <div className="modal"><div className="dialog"><h2>Delete local response history?</h2><p>This permanently removes every locally saved survey and question answer from this PC.</p><div className="dialog-actions"><button className="secondary-button" onClick={() => setConfirmClear(false)}>Cancel</button><button className="danger-button" onClick={() => void clear()}>Delete history</button></div></div></div>}</>;
}

function SettingToggle({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="setting-toggle"><span><strong>{title}</strong><small>{description}</small></span><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)}/><i aria-hidden="true"/></label>;
}

export function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [page, setPage] = useState<Page>('Home');
  const [collapsed, setCollapsed] = useState(false);
  const [menu, setMenu] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const { dock, formats, displays, settings, activity, responses, setSettings } = useDesktopData();
  if (!dock || !settings) return <div className="dashboard-loading"><img src={logo} alt="Ads on Demand"/><span>Preparing your desktop…</span></div>;
  async function signOut() { await window.aodDesktop.closeDock(); onSignOut(); }
  return <div id="aod-dashboard-preview" className={collapsed ? 'collapsed' : ''}><div className="window"><aside className="sidebar" aria-label="Application navigation"><div className="brand-row"><div className="dashboard-logo-frame"><img className="logo" src={logo} alt="Ads on Demand"/></div><button className="collapse" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed} onClick={() => setCollapsed(value => !value)}><PanelLeftClose size={17}/></button></div><nav className="nav">{pages.map((item, index) => { const Icon = navIcons[index]; return <button key={item} className={`nav-button ${page === item ? 'is-active' : ''}`} title={item} aria-label={item} aria-current={page === item ? 'page' : undefined} onClick={() => setPage(item)}><Icon size={18}/><span className="nav-label">{item}</span></button>; })}</nav><div className="sidebar-bottom"><div className="device"><span className="online-dot"/><span>This PC · Local session</span></div><button className="profile-button" aria-label="Account menu" aria-expanded={menu} onClick={() => setMenu(value => !value)}><span className="avatar">J</span><span className="profile-copy"><strong>Personal account</strong><span>Free plan</span></span></button>{menu && <div className="profile-menu"><button className="menu-button" onClick={() => void signOut()}><LogOut size={16}/>Sign out</button></div>}</div></aside><section className="main"><header className="topbar"><div className="page-heading"><strong>{page}</strong><span>{page === 'Docks' ? 'Control what appears on your desktop' : 'Your desktop at a glance'}</span></div><button className="close-button" disabled={dock.status === 'stopped'} onClick={() => setConfirmClose(true)}><X size={16}/>Close all</button></header><main className="content">
    {page === 'Home' && <HomePage dock={dock} goToDocks={() => setPage('Docks')} goToEarnings={() => setPage('Earnings')}/>}
    {page === 'Docks' && <DocksPage dock={dock} formats={formats} displays={displays}/>}
    {page === 'Earnings' && <><section className="home-intro"><h1>Your earnings</h1><p>Available $0.00 · Today $0.00</p></section><Chart/></>}
    {page === 'Activity' && <ActivityPage events={activity}/>}
    {page === 'Settings' && <SettingsPage settings={settings} responses={responses} onSettings={setSettings}/>}
    {(page === 'Profile' || page === 'Help') && <section className="placeholder"><div className="placeholder-inner"><h1>{page}</h1><p>{page === 'Profile' ? 'Account and interest preferences will arrive with the shared account service.' : 'This local build demonstrates the native dock system. Production support tools are still being prepared.'}</p><button className="secondary-button" onClick={() => setPage('Home')}>Back to Home</button></div></section>}
  </main></section></div>{confirmClose && <div className="modal"><div className="dialog"><h2>Close the running dock?</h2><p>Your setup stays saved. Start it again from Docks.</p><div className="dialog-actions"><button className="secondary-button" onClick={() => setConfirmClose(false)}>Cancel</button><button className="close-button" onClick={() => { void window.aodDesktop.closeDock(); setConfirmClose(false); }}>Close dock</button></div></div></div>}</div>;
}

