import { vi } from 'vitest';

vi.mock('~/lib/webcontainer', () => {
  return {
    webcontainer: {
      fs: {
        readFile: vi.fn(),
        writeFile: vi.fn(),
        rm: vi.fn(),
        mkdir: vi.fn(),
      },
      spawn: vi.fn(),
      on: vi.fn(),
      loadFiles: vi.fn(),
    },
  };
});

vi.mock('~/lib/stores/files', () => {
  return {
    FilesStore: vi.fn(() => ({
      files: new Map(),
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      clear: vi.fn(),
      keys: vi.fn(),
      values: vi.fn(),
      entries: vi.fn(),
      forEach: vi.fn(),
    })),
  };
});