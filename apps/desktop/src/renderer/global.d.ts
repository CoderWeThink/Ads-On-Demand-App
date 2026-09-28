import type { AodDesktopApi } from '../shared/types';

declare global {
  interface Window { aodDesktop: AodDesktopApi }
}

export {};

