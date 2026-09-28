export type DockFormat = 'image' | 'video' | 'question' | 'survey';
export type DockStatus = 'running' | 'stopped';
export type DockPreset = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left-edge' | 'right-edge' | 'custom';

export interface DockPlacement {
  displayId: string;
  preset: DockPreset;
  normalizedX: number;
  normalizedY: number;
  scale: number;
}

export interface DockBounds { x: number; y: number; width: number; height: number }

export interface ConnectedDisplay {
  id: string;
  label: string;
  primary: boolean;
  bounds: DockBounds;
  workArea: DockBounds;
  scaleFactor: number;
}

export interface DockOption { id: string; label: string }

export interface DockContent {
  id: string;
  format: DockFormat;
  campaignId: string;
  advertiser: string;
  sponsoredLabel: string;
  title: string;
  body?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  promptId?: string;
  options?: DockOption[];
  multiple?: boolean;
}

export interface DockConfiguration {
  id: string;
  format: DockFormat;
  name: string;
  placement: DockPlacement;
}

export interface DockState {
  status: DockStatus;
  activeConfigurationId: string | null;
  activeFormat: DockFormat | null;
  placement: DockPlacement;
  bounds: DockBounds | null;
  repositioning: boolean;
  content: DockContent | null;
}

export interface LocalResponse {
  id: string;
  format: 'question' | 'survey';
  campaignId: string;
  creativeId: string;
  promptId: string;
  selectedOptionIds: string[];
  selectedLabels: string[];
  prompt: string;
  submittedAt: string;
  deviceId: string;
  localOnly: true;
  schemaVersion: 1;
}

export type ActivityKind = 'dock-started' | 'dock-closed' | 'dock-replaced' | 'dock-repositioned' | 'response-submitted' | 'history-cleared' | 'setting-changed';
export interface ActivityEvent { id: string; kind: ActivityKind; message: string; createdAt: string }

export interface AppSettings {
  continueInBackground: boolean;
  launchAtLogin: boolean;
  restoreLastDock: boolean;
}

export interface PersistedAppState {
  schemaVersion: 1;
  deviceId: string;
  settings: AppSettings;
  configurations: DockConfiguration[];
  lastRunningConfigurationId: string | null;
  responses: LocalResponse[];
  activity: ActivityEvent[];
  cleanShutdown: boolean;
}

export interface SubmitResponseInput { promptId: string; selectedOptionIds: string[] }

export interface AodDesktopApi {
  getDockState(): Promise<DockState>;
  listDockFormats(): Promise<DockConfiguration[]>;
  startDock(configurationId: string): Promise<DockState>;
  closeDock(): Promise<DockState>;
  beginReposition(): Promise<DockState>;
  previewPlacement(placement: DockPlacement): Promise<DockState>;
  commitReposition(): Promise<DockState>;
  cancelReposition(): Promise<DockState>;
  applyPlacement(placement: DockPlacement): Promise<DockState>;
  submitResponse(response: SubmitResponseInput): Promise<LocalResponse>;
  getResponseHistory(): Promise<LocalResponse[]>;
  clearResponseHistory(): Promise<void>;
  getActivity(): Promise<ActivityEvent[]>;
  getSettings(): Promise<AppSettings>;
  updateSettings(changes: Partial<AppSettings>): Promise<AppSettings>;
  getDisplays(): Promise<ConnectedDisplay[]>;
  openExternal(url: string): Promise<void>;
  openDashboard(): Promise<void>;
  quitApplication(): Promise<void>;
  onDockStateChanged(listener: (state: DockState) => void): () => void;
  onRepositionStateChanged(listener: (state: DockState) => void): () => void;
  onSettingsChanged(listener: (settings: AppSettings) => void): () => void;
  onActivityChanged(listener: (activity: ActivityEvent[]) => void): () => void;
}

