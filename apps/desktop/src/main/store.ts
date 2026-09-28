import { app, safeStorage } from 'electron';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { dockConfigurations } from '../shared/content';
import type { PersistedAppState } from '../shared/types';

const defaultState = (): PersistedAppState => ({
  schemaVersion: 1,
  deviceId: randomUUID(),
  settings: { continueInBackground: true, launchAtLogin: false, restoreLastDock: false },
  configurations: dockConfigurations.map(configuration => ({ ...configuration, placement: { ...configuration.placement } })),
  lastRunningConfigurationId: null,
  responses: [],
  activity: [],
  cleanShutdown: true,
});

export class StateStore {
  private state: PersistedAppState = defaultState();
  private readonly filePath = path.join(app.getPath('userData'), 'local-state.bin');
  private writeChain = Promise.resolve();

  async load(): Promise<PersistedAppState> {
    try {
      const encrypted = await fs.readFile(this.filePath);
      if (!safeStorage.isEncryptionAvailable()) throw new Error('Windows secure storage is unavailable.');
      const parsed = JSON.parse(safeStorage.decryptString(encrypted)) as Partial<PersistedAppState>;
      if (parsed.schemaVersion !== 1) throw new Error('Unsupported local-state schema.');
      const defaults = defaultState();
      this.state = {
        ...defaults,
        ...parsed,
        settings: { ...defaults.settings, ...parsed.settings },
        configurations: dockConfigurations.map(fallback => {
          const saved = parsed.configurations?.find(configuration => configuration.id === fallback.id);
          return saved ? { ...fallback, ...saved, placement: { ...fallback.placement, ...saved.placement } } : fallback;
        }),
        responses: Array.isArray(parsed.responses) ? parsed.responses : [],
        activity: Array.isArray(parsed.activity) ? parsed.activity.slice(0, 250) : [],
      };
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== 'ENOENT') console.warn('Unable to read encrypted local state; starting with safe defaults.', error);
      this.state = defaultState();
    }
    return this.snapshot();
  }

  snapshot(): PersistedAppState {
    return structuredClone(this.state);
  }

  async update(mutator: (state: PersistedAppState) => void): Promise<PersistedAppState> {
    mutator(this.state);
    this.state.activity = this.state.activity.slice(0, 250);
    await this.save();
    return this.snapshot();
  }

  async save(): Promise<void> {
    const serialized = JSON.stringify(this.state);
    this.writeChain = this.writeChain.then(async () => {
      if (!safeStorage.isEncryptionAvailable()) throw new Error('Windows secure storage is unavailable.');
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      const temporaryPath = `${this.filePath}.tmp`;
      await fs.writeFile(temporaryPath, safeStorage.encryptString(serialized));
      await fs.rename(temporaryPath, this.filePath);
    });
    return this.writeChain;
  }
}

