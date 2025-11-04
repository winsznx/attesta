import { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }

  namespace NodeJS {
    interface Global {
      Buffer: typeof Buffer;
    }
  }

  var Buffer: typeof Buffer;
}

export {};
