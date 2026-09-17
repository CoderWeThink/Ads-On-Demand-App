import { app, BrowserWindow, session } from 'electron';
import path from 'node:path';

function openWelcome() {
  const win = new BrowserWindow({ width: 1120, height: 780, minWidth: 760, minHeight: 680, title: 'Ads on Demand', backgroundColor: '#07111b', autoHideMenuBar: true, show: false, webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true } });
  win.removeMenu();
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', event => event.preventDefault());
  win.once('ready-to-show', () => win.show());
  void win.loadFile(path.join(__dirname, '../renderer/index.html'));
}
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => { const win = BrowserWindow.getAllWindows()[0]; if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  void app.whenReady().then(() => { session.defaultSession.setPermissionRequestHandler((_web, _permission, callback) => callback(false)); session.defaultSession.setPermissionCheckHandler(() => false); openWelcome(); });
  app.on('window-all-closed', () => app.quit());
}
