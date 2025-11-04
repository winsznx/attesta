/**
 * Browser polyfills for @dfinity packages
 * This must be imported before any @dfinity imports
 */

import { Buffer } from 'buffer';

// Polyfill Buffer for browser environment
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (globalThis as any).Buffer = Buffer;
}

// Also set on global object
if (typeof global !== 'undefined') {
  (global as any).Buffer = Buffer;
}

export {};
