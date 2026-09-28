import { contextBridge, ipcRenderer } from 'electron';
import type { AodDesktopApi, ActivityEvent, AppSettings, DockPlacement, DockState } from '../shared/types';

const subscribe = <T>(channel: string, listener: (value: T) => void) => {
  const handler = (_event: Electron.IpcRendererEvent, value: T) => listener(value);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
};

const api: AodDesktopApi = {
  getDockState: () => ipcRenderer.invoke('aod:dock:get'),
  listDockFormats: () => ipcRenderer.invoke('aod:dock:list'),
  startDock: configurationId => ipcRenderer.invoke('aod:dock:start', configurationId),
  closeDock: () => ipcRenderer.invoke('aod:dock:close'),
  beginReposition: () => ipcRenderer.invoke('aod:dock:reposition-begin'),
  previewPlacement: placement => ipcRenderer.invoke('aod:dock:placement-preview', placement),
  commitReposition: () => ipcRenderer.invoke('aod:dock:reposition-commit'),
  cancelReposition: () => ipcRenderer.invoke('aod:dock:reposition-cancel'),
  applyPlacement: placement => ipcRenderer.invoke('aod:dock:placement-apply', placement),
  submitResponse: response => ipcRenderer.invoke('aod:response:submit', response),
  getResponseHistory: () => ipcRenderer.invoke('aod:response:list'),
  clearResponseHistory: () => ipcRenderer.invoke('aod:response:clear'),
  getActivity: () => ipcRenderer.invoke('aod:activity:list'),
  getSettings: () => ipcRenderer.invoke('aod:settings:get'),
  updateSettings: changes => ipcRenderer.invoke('aod:settings:update', changes),
  getDisplays: () => ipcRenderer.invoke('aod:display:list'),
  openExternal: url => ipcRenderer.invoke('aod:external:open', url),
  openDashboard: () => ipcRenderer.invoke('aod:dashboard:open'),
  quitApplication: () => ipcRenderer.invoke('aod:app:quit'),
  onDockStateChanged: listener => subscribe<DockState>('aod:event:dock-state', listener),
  onRepositionStateChanged: listener => subscribe<DockState>('aod:event:reposition', listener),
  onSettingsChanged: listener => subscribe<AppSettings>('aod:event:settings', listener),
  onActivityChanged: listener => subscribe<ActivityEvent[]>('aod:event:activity', listener),
};

contextBridge.exposeInMainWorld('aodDesktop', api);

