import { beforeEach, describe, expect, it, vi } from 'vitest';

let cacheModule;

beforeEach(async () => {
  const store = {};
  vi.stubGlobal('localStorage', {
    getItem: (key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
    key: (index) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length;
    }
  });
  vi.stubGlobal('indexedDB', undefined);
  cacheModule = await import('../src/services/embeddingsCache.js');
});

describe('embeddings cache (localStorage fallback)', () => {
  it('saves and loads embeddings', async () => {
    const sample = [{ id: 'doc-1', text: 'hello', embedding: [0.1, 0.2] }];
    const saved = await cacheModule.saveCachedEmbeddings(sample);
    expect(saved).toBe(true);

    const loaded = await cacheModule.loadCachedEmbeddings();
    expect(Array.isArray(loaded)).toBe(true);
    expect(loaded[0].id).toBe('doc-1');
  });

  it('caches queries', async () => {
    const query = 'profit';
    const results = [{ id: 'lesson-2', score: 0.8 }];
    const saved = await cacheModule.saveCachedQuery(query, results);
    expect(saved).toBe(true);

    const cached = await cacheModule.getCachedQuery(query);
    expect(Array.isArray(cached)).toBe(true);
    expect(cached[0].id).toBe('lesson-2');
  });

  it('clears cache', async () => {
    await cacheModule.saveCachedEmbeddings([{ id: 'doc' }]);
    await cacheModule.saveCachedQuery('framework', [{ id: 'lesson' }]);
    await cacheModule.clearAll();
    const loaded = await cacheModule.loadCachedEmbeddings();
    const cachedQuery = await cacheModule.getCachedQuery('framework');
    expect(loaded).toBeNull();
    expect(cachedQuery).toBeNull();
  });
});

