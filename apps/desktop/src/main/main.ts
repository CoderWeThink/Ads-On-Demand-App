import { app, BrowserWindow, dialog, ipcMain, Menu, nativeImage, screen, session, shell, Tray } from 'electron';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { dockContent, defaultPlacement } from '../shared/content';
import type {
  ActivityEvent, AppSettings, ConnectedDisplay, DockBounds, DockConfiguration, DockPlacement, DockPreset, DockState,
  LocalResponse, SubmitResponseInput,
} from '../shared/types';
import { StateStore } from './store';

const APP_ID = 'com.adsondemand.desktop';
const allowedPresets = new Set<DockPreset>(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'left-edge', 'right-edge', 'custom']);

class AppController {
  private dashboardWindow: BrowserWindow | null = null;
  private dockWindow: BrowserWindow | null = null;
  private tray: Tray | null = null;
  private readonly store = new StateStore();
  private activeConfigurationId: string | null = null;
  private isQuitting = false;
  private dashboardHiddenToTray = false;
  private repositionOrigin: DockBounds | null = null;
  private placementPreviewOrigin: DockBounds | null = null;

  async initialize() {
    const state = await this.store.load();
    await this.store.update(current => { current.cleanShutdown = false; });
    app.setLoginItemSettings({ openAtLogin: state.settings.launchAtLogin, path: process.execPath });
    this.createDashboardWindow();
    this.createTray();
    this.registerDisplayRecovery();
    if (state.settings.restoreLastDock && state.lastRunningConfigurationId) await this.startDock(state.lastRunningConfigurationId, false);
  }

  private resourcePath(...segments: string[]) {
    if (app.isPackaged) return path.join(process.resourcesPath, ...segments);
    if (segments[0] === 'branding') return path.join(app.getAppPath(), 'build', ...segments.slice(1));
    return path.join(app.getAppPath(), ...segments);
  }

  private createDashboardWindow() {
    const win = new BrowserWindow({
      width: 1240, height: 830, minWidth: 900, minHeight: 680,
      title: 'Ads on Demand', icon: this.resourcePath('branding', 'icon.ico'),
      backgroundColor: '#050b12', autoHideMenuBar: true, show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'), nodeIntegration: false, contextIsolation: true,
        sandbox: true, webSecurity: true,
      },
    });
    win.removeMenu();
    this.secureWindow(win);
    win.on('close', event => {
      if (this.isQuitting) return;
      event.preventDefault();
      if (!this.isDockRunning()) {
        void this.quitApplication();
        return;
      }
      if (this.store.snapshot().settings.continueInBackground) {
        this.dashboardHiddenToTray = true;
        win.hide();
        this.updateTray();
        return;
      }
      void dialog.showMessageBox(win, {
        type: 'question', title: 'Quit Ads on Demand?', message: 'Quitting will close your running dock.',
        detail: 'Your saved dock setup and local activity will remain on this PC.',
        buttons: ['Cancel', 'Quit Ads on Demand'], defaultId: 0, cancelId: 0, noLink: true,
      }).then(result => { if (result.response === 1) void this.quitApplication(); });
    });
    win.once('ready-to-show', () => win.show());
    win.on('closed', () => {
      this.dashboardWindow = null;
      this.dashboardHiddenToTray = this.isDockRunning();
      if (!this.isQuitting && !this.isDockRunning()) void this.quitApplication();
    });
    this.dashboardWindow = win;
    void win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  private secureWindow(win: BrowserWindow) {
    win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    win.webContents.on('will-navigate', event => event.preventDefault());
  }

  private createTray() {
    const icon = nativeImage.createFromPath(this.resourcePath('branding', 'tray-icon.png')).resize({ width: 24, height: 24 });
    this.tray = new Tray(icon);
    this.tray.setToolTip('Ads on Demand');
    this.tray.on('double-click', () => this.openDashboard());
    this.updateTray();
  }

  private updateTray() {
    if (!this.tray) return;
    const running = this.isDockRunning();
    this.tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'Open Ads on Demand', click: () => this.openDashboard() },
      { type: 'separator' },
      { label: `Dock status: ${running ? 'Running' : 'Stopped'}`, enabled: false },
      { label: 'Close dock', enabled: running, click: () => void this.closeDock(true) },
      { type: 'separator' },
      { label: 'Quit Ads on Demand', click: () => void this.quitApplication() },
    ]));
  }

  openDashboard() {
    if (!this.dashboardWindow || this.dashboardWindow.isDestroyed()) this.createDashboardWindow();
    const win = this.dashboardWindow!;
    this.dashboardHiddenToTray = false;
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  }

  async quitApplication() {
    if (this.isQuitting) return;
    this.isQuitting = true;
    this.destroyDockWindow();
    this.tray?.destroy();
    this.tray = null;
    await this.store.update(state => { state.cleanShutdown = true; });
    this.dashboardWindow?.destroy();
    app.quit();
  }

  private isDockRunning() {
    return Boolean(this.activeConfigurationId && this.dockWindow && !this.dockWindow.isDestroyed());
  }

  private quitIfBackgroundIsIdle() {
    if (this.dashboardHiddenToTray && !this.isDockRunning()) void this.quitApplication();
  }

  private registerDisplayRecovery() {
    const recover = () => {
      if (!this.dockWindow || !this.activeConfigurationId) return;
      const configuration = this.findConfiguration(this.activeConfigurationId);
      const placement = this.validatePlacement(configuration.placement);
      this.dockWindow.setBounds(this.boundsFor(placement, configuration.format));
      void this.saveConfigurationPlacement(configuration.id, placement);
      this.broadcastDockState();
    };
    screen.on('display-removed', recover);
    screen.on('display-metrics-changed', recover);
  }

  private findConfiguration(id: string): DockConfiguration {
    const configuration = this.store.snapshot().configurations.find(item => item.id === id);
    if (!configuration) throw new Error('Unknown dock configuration.');
    return configuration;
  }

  private dimensionsFor(format: DockConfiguration['format'], scale: number) {
    const base = format === 'survey' ? { width: 430, height: 292 }
      : format === 'question' ? { width: 430, height: 228 } : { width: 430, height: 184 };
    return { width: Math.round(base.width * scale), height: Math.round(base.height * scale) };
  }

  private selectedDisplay(displayId: string) {
    return screen.getAllDisplays().find(display => String(display.id) === displayId) ?? screen.getPrimaryDisplay();
  }

  private validatePlacement(input: DockPlacement): DockPlacement {
    const scale = Number.isFinite(input?.scale) ? Math.min(1.25, Math.max(0.75, input.scale)) : 1;
    const preset = allowedPresets.has(input?.preset) ? input.preset : 'top-right';
    const display = this.selectedDisplay(input?.displayId ?? 'primary');
    return {
      displayId: String(display.id), preset,
      normalizedX: Math.min(1, Math.max(0, Number.isFinite(input?.normalizedX) ? input.normalizedX : defaultPlacement.normalizedX)),
      normalizedY: Math.min(1, Math.max(0, Number.isFinite(input?.normalizedY) ? input.normalizedY : defaultPlacement.normalizedY)),
      scale,
    };
  }

  private boundsFor(input: DockPlacement, format: DockConfiguration['format']): DockBounds {
    const placement = this.validatePlacement(input);
    const work = this.selectedDisplay(placement.displayId).workArea;
    const size = this.dimensionsFor(format, placement.scale);
    const maxX = Math.max(work.x, work.x + work.width - size.width);
    const maxY = Math.max(work.y, work.y + work.height - size.height);
    const margin = 20;
    const positions: Record<Exclude<DockPreset, 'custom'>, { x: number; y: number }> = {
      'top-left': { x: work.x + margin, y: work.y + margin },
      'top-right': { x: maxX - margin, y: work.y + margin },
      'bottom-left': { x: work.x + margin, y: maxY - margin },
      'bottom-right': { x: maxX - margin, y: maxY - margin },
      'left-edge': { x: work.x + margin, y: work.y + Math.round((work.height - size.height) / 2) },
      'right-edge': { x: maxX - margin, y: work.y + Math.round((work.height - size.height) / 2) },
    };
    const chosen = placement.preset === 'custom'
      ? { x: work.x + Math.round((work.width - size.width) * placement.normalizedX), y: work.y + Math.round((work.height - size.height) * placement.normalizedY) }
      : positions[placement.preset];
    return {
      x: Math.min(maxX, Math.max(work.x, chosen.x)), y: Math.min(maxY, Math.max(work.y, chosen.y)),
      width: Math.min(size.width, work.width), height: Math.min(size.height, work.height),
    };
  }

  private createDockWindow(configuration: DockConfiguration) {
    const placement = this.validatePlacement(configuration.placement);
    const win = new BrowserWindow({
      ...this.boundsFor(placement, configuration.format),
      title: `Ads on Demand — ${configuration.name}`, icon: this.resourcePath('branding', 'icon.ico'),
      frame: false, transparent: true, backgroundColor: '#00000000', alwaysOnTop: true, skipTaskbar: true,
      resizable: false, movable: false, minimizable: false, maximizable: false, fullscreenable: false,
      closable: false, show: false, hasShadow: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'), nodeIntegration: false, contextIsolation: true,
        sandbox: true, webSecurity: true,
      },
    });
    this.secureWindow(win);
    win.setAlwaysOnTop(true, 'screen-saver');
    win.on('move', () => { if (this.repositionOrigin) this.broadcastDockState(); });
    win.once('ready-to-show', () => win.showInactive());
    win.on('closed', () => {
      if (this.dockWindow !== win) return;
      this.dockWindow = null;
      this.activeConfigurationId = null;
      void this.store.update(state => { state.lastRunningConfigurationId = null; }).finally(() => {
        this.updateTray();
        this.broadcastAll();
        this.quitIfBackgroundIsIdle();
      });
    });
    this.dockWindow = win;
    void win.loadFile(path.join(__dirname, '../renderer/index.html'), { query: { surface: 'dock' } });
  }

  private destroyDockWindow() {
    const win = this.dockWindow;
    this.dockWindow = null;
    this.repositionOrigin = null;
    this.placementPreviewOrigin = null;
    if (win && !win.isDestroyed()) win.destroy();
  }

  async startDock(configurationId: string, recordActivity = true): Promise<DockState> {
    const configuration = this.findConfiguration(configurationId);
    const previous = this.activeConfigurationId;
    if (previous === configurationId && this.dockWindow && !this.dockWindow.isDestroyed()) return this.getDockState();
    this.destroyDockWindow();
    this.activeConfigurationId = configurationId;
    this.createDockWindow(configuration);
    await this.store.update(state => {
      state.lastRunningConfigurationId = configurationId;
      if (recordActivity) this.prependActivity(state.activity, previous
        ? { kind: 'dock-replaced', message: `Switched from ${this.findConfiguration(previous).name} to ${configuration.name}` }
        : { kind: 'dock-started', message: `Started ${configuration.name}` });
    });
    this.updateTray();
    this.broadcastAll();
    return this.getDockState();
  }

  async closeDock(recordActivity = true): Promise<DockState> {
    const previous = this.activeConfigurationId;
    this.destroyDockWindow();
    this.activeConfigurationId = null;
    await this.store.update(state => {
      state.lastRunningConfigurationId = null;
      if (recordActivity && previous) this.prependActivity(state.activity, { kind: 'dock-closed', message: `Closed ${this.findConfiguration(previous).name}` });
    });
    this.updateTray();
    this.broadcastAll();
    const dockState = this.getDockState();
    this.quitIfBackgroundIsIdle();
    return dockState;
  }

  getDockState(): DockState {
    const configuration = this.activeConfigurationId ? this.findConfiguration(this.activeConfigurationId) : null;
    return {
      status: configuration && this.dockWindow && !this.dockWindow.isDestroyed() ? 'running' : 'stopped',
      activeConfigurationId: configuration?.id ?? null, activeFormat: configuration?.format ?? null,
      placement: configuration ? this.validatePlacement(configuration.placement) : this.validatePlacement(defaultPlacement),
      bounds: this.dockWindow && !this.dockWindow.isDestroyed() ? this.dockWindow.getBounds() : null,
      repositioning: Boolean(this.repositionOrigin), content: configuration ? dockContent[configuration.format] : null,
    };
  }

  async beginReposition(): Promise<DockState> {
    if (!this.dockWindow || !this.activeConfigurationId) throw new Error('Start a dock before repositioning it.');
    if (!this.repositionOrigin) this.repositionOrigin = this.dockWindow.getBounds();
    this.dockWindow.setMovable(true);
    this.broadcast('aod:event:reposition', this.getDockState());
    this.broadcastDockState();
    return this.getDockState();
  }

  async previewPlacement(input: DockPlacement): Promise<DockState> {
    if (!this.dockWindow || !this.activeConfigurationId) throw new Error('Start a dock before previewing placement.');
    if (!this.placementPreviewOrigin) this.placementPreviewOrigin = this.dockWindow.getBounds();
    const configuration = this.findConfiguration(this.activeConfigurationId);
    this.dockWindow.setBounds(this.boundsFor(this.validatePlacement(input), configuration.format));
    this.broadcastDockState();
    return this.getDockState();
  }

  async applyPlacement(input: DockPlacement): Promise<DockState> {
    if (!this.dockWindow || !this.activeConfigurationId) throw new Error('Start a dock before applying placement.');
    const placement = this.validatePlacement(input);
    const configuration = this.findConfiguration(this.activeConfigurationId);
    this.dockWindow.setBounds(this.boundsFor(placement, configuration.format));
    await this.saveConfigurationPlacement(configuration.id, placement);
    this.placementPreviewOrigin = null;
    await this.addActivity({ kind: 'dock-repositioned', message: `Moved ${configuration.name} to ${this.displayLabel(placement.displayId)} · ${this.presetLabel(placement.preset)}` });
    this.broadcastAll();
    return this.getDockState();
  }

  async commitReposition(): Promise<DockState> {
    if (!this.dockWindow || !this.activeConfigurationId || !this.repositionOrigin) return this.getDockState();
    const configuration = this.findConfiguration(this.activeConfigurationId);
    const bounds = this.dockWindow.getBounds();
    const display = screen.getDisplayMatching(bounds);
    const work = display.workArea;
    const placement: DockPlacement = {
      displayId: String(display.id), preset: 'custom',
      normalizedX: work.width === bounds.width ? 0 : (bounds.x - work.x) / (work.width - bounds.width),
      normalizedY: work.height === bounds.height ? 0 : (bounds.y - work.y) / (work.height - bounds.height),
      scale: configuration.placement.scale,
    };
    this.repositionOrigin = null;
    this.dockWindow.setMovable(false);
    await this.saveConfigurationPlacement(configuration.id, this.validatePlacement(placement));
    await this.addActivity({ kind: 'dock-repositioned', message: `Repositioned ${configuration.name} on ${this.displayLabel(String(display.id))}` });
    this.broadcastAll();
    return this.getDockState();
  }

  async cancelReposition(): Promise<DockState> {
    if (this.dockWindow && this.repositionOrigin) this.dockWindow.setBounds(this.repositionOrigin);
    if (this.dockWindow && this.placementPreviewOrigin) this.dockWindow.setBounds(this.placementPreviewOrigin);
    this.repositionOrigin = null;
    this.placementPreviewOrigin = null;
    this.dockWindow?.setMovable(false);
    this.broadcastDockState();
    return this.getDockState();
  }

  private async saveConfigurationPlacement(id: string, placement: DockPlacement) {
    await this.store.update(state => {
      const configuration = state.configurations.find(item => item.id === id);
      if (configuration) configuration.placement = placement;
    });
  }

  async submitResponse(input: SubmitResponseInput): Promise<LocalResponse> {
    const content = this.getDockState().content;
    if (!content || (content.format !== 'question' && content.format !== 'survey') || !content.promptId || !content.options) throw new Error('The active dock does not accept responses.');
    if (input?.promptId !== content.promptId || !Array.isArray(input.selectedOptionIds)) throw new Error('Invalid response.');
    const selected = [...new Set(input.selectedOptionIds)];
    const allowed = new Map(content.options.map(option => [option.id, option.label]));
    if (selected.length < 1 || (!content.multiple && selected.length !== 1) || selected.some(id => !allowed.has(id))) throw new Error('Select a valid answer.');
    if (this.store.snapshot().responses.some(response => response.creativeId === content.id && response.promptId === content.promptId)) throw new Error('This response has already been saved.');
    const response: LocalResponse = {
      id: randomUUID(), format: content.format, campaignId: content.campaignId, creativeId: content.id,
      promptId: content.promptId, selectedOptionIds: selected, selectedLabels: selected.map(id => allowed.get(id)!),
      prompt: content.title, submittedAt: new Date().toISOString(), deviceId: this.store.snapshot().deviceId,
      localOnly: true, schemaVersion: 1,
    };
    await this.store.update(persisted => {
      persisted.responses.unshift(response);
      this.prependActivity(persisted.activity, {
        kind: 'response-submitted', message: content.format === 'question'
          ? `Answered “${response.selectedLabels[0]}” for “${content.title}”`
          : `Submitted a survey response: ${response.selectedLabels.join(', ')}`,
      });
    });
    this.broadcastAll();
    return response;
  }

  async clearResponseHistory() {
    await this.store.update(state => {
      state.responses = [];
      this.prependActivity(state.activity, { kind: 'history-cleared', message: 'Cleared local response history' });
    });
    this.broadcastAll();
  }

  async updateSettings(changes: Partial<AppSettings>): Promise<AppSettings> {
    const allowed: Partial<AppSettings> = {};
    for (const key of ['continueInBackground', 'launchAtLogin', 'restoreLastDock'] as const) {
      if (typeof changes?.[key] === 'boolean') Object.assign(allowed, { [key]: changes[key] });
    }
    await this.store.update(state => {
      state.settings = { ...state.settings, ...allowed };
      for (const [key, value] of Object.entries(allowed)) this.prependActivity(state.activity, { kind: 'setting-changed', message: `${this.settingLabel(key)} ${value ? 'enabled' : 'disabled'}` });
    });
    const settings = this.store.snapshot().settings;
    app.setLoginItemSettings({ openAtLogin: settings.launchAtLogin, path: process.execPath });
    this.broadcast('aod:event:settings', settings);
    this.broadcast('aod:event:activity', this.store.snapshot().activity);
    return settings;
  }

  displays(): ConnectedDisplay[] {
    const primaryId = screen.getPrimaryDisplay().id;
    return screen.getAllDisplays().map((display, index) => ({
      id: String(display.id), label: display.id === primaryId ? 'Display 1 · Primary' : `Display ${index + 1}`,
      primary: display.id === primaryId, bounds: display.bounds, workArea: display.workArea, scaleFactor: display.scaleFactor,
    }));
  }

  async openExternal(url: string) {
    const parsed = new URL(url);
    const allowedUrls = new Set(Object.values(dockContent).map(content => content.ctaUrl).filter(Boolean));
    if (parsed.protocol !== 'https:' || !allowedUrls.has(parsed.toString())) throw new Error('This link is not approved.');
    await shell.openExternal(parsed.toString());
  }

  private displayLabel(id: string) { return this.displays().find(display => display.id === id)?.label ?? 'Primary display'; }
  private presetLabel(preset: DockPreset) { return preset === 'custom' ? 'Custom position' : preset.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join(' '); }
  private settingLabel(key: string) { return ({ continueInBackground: 'Continue in background', launchAtLogin: 'Launch at sign-in', restoreLastDock: 'Restore last dock' } as Record<string, string>)[key] ?? key; }
  private prependActivity(activity: ActivityEvent[], input: Pick<ActivityEvent, 'kind' | 'message'>) { activity.unshift({ id: randomUUID(), createdAt: new Date().toISOString(), ...input }); }
  private async addActivity(input: Pick<ActivityEvent, 'kind' | 'message'>) { await this.store.update(state => this.prependActivity(state.activity, input)); }

  private broadcast(channel: string, value: unknown) {
    for (const win of [this.dashboardWindow, this.dockWindow]) if (win && !win.isDestroyed()) win.webContents.send(channel, value);
  }
  private broadcastDockState() { this.broadcast('aod:event:dock-state', this.getDockState()); }
  private broadcastAll() {
    this.broadcastDockState();
    this.broadcast('aod:event:reposition', this.getDockState());
    this.broadcast('aod:event:activity', this.store.snapshot().activity);
  }

  registerIpc() {
    const trusted = (event: Electron.IpcMainInvokeEvent) => [this.dashboardWindow, this.dockWindow].some(win => win && !win.isDestroyed() && win.webContents.id === event.sender.id);
    const handle = (channel: string, listener: (event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => unknown) => {
      ipcMain.handle(channel, (event, ...args) => {
        if (!trusted(event)) throw new Error('Untrusted application surface.');
        return listener(event, ...args);
      });
    };
    handle('aod:dock:get', () => this.getDockState());
    handle('aod:dock:list', () => this.store.snapshot().configurations);
    handle('aod:dock:start', (_event, id) => this.startDock(String(id)));
    handle('aod:dock:close', () => this.closeDock(true));
    handle('aod:dock:reposition-begin', () => this.beginReposition());
    handle('aod:dock:placement-preview', (_event, placement) => this.previewPlacement(placement as DockPlacement));
    handle('aod:dock:placement-apply', (_event, placement) => this.applyPlacement(placement as DockPlacement));
    handle('aod:dock:reposition-commit', () => this.commitReposition());
    handle('aod:dock:reposition-cancel', () => this.cancelReposition());
    handle('aod:response:submit', (_event, input) => this.submitResponse(input as SubmitResponseInput));
    handle('aod:response:list', () => this.store.snapshot().responses);
    handle('aod:response:clear', () => this.clearResponseHistory());
    handle('aod:activity:list', () => this.store.snapshot().activity);
    handle('aod:settings:get', () => this.store.snapshot().settings);
    handle('aod:settings:update', (_event, changes) => this.updateSettings(changes as Partial<AppSettings>));
    handle('aod:display:list', () => this.displays());
    handle('aod:external:open', (_event, url) => this.openExternal(String(url)));
    handle('aod:dashboard:open', () => this.openDashboard());
    handle('aod:app:quit', () => this.quitApplication());
  }
}
app.setName('Ads on Demand');
app.setAppUserModelId(APP_ID);

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  const controller = new AppController();
  app.on('second-instance', () => controller.openDashboard());
  app.on('window-all-closed', () => { /* dashboard can be hidden while the dock and tray continue */ });
  void app.whenReady().then(async () => {
    session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
    session.defaultSession.setPermissionCheckHandler(() => false);
    controller.registerIpc();
    await controller.initialize();
  });
}

