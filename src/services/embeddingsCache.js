const EMBEDDINGS_KEY = 'casequest:embeddings';
const QUERY_CACHE_KEY = 'casequest:querycache';

function localStorageAvailable() {
  try {
    return typeof localStorage !== 'undefined' && localStorage !== null;
  } catch {
    return false;
  }
}

function openDb(dbName = 'casequest-cache') {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('embeddings')) {
        db.createObjectStore('embeddings');
      }
      if (!db.objectStoreNames.contains('queries')) {
        db.createObjectStore('queries');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGet(storeName, key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(storeName, key, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(value, key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

async function idbClear(storeName) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.clear();
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

export async function loadCachedEmbeddings() {
  if (globalThis.indexedDB) {
    try {
      const cached = await idbGet('embeddings', EMBEDDINGS_KEY);
      if (cached) return cached;
    } catch {
      // ignore, fallback below
    }
  }
  if (localStorageAvailable()) {
    try {
      const raw = localStorage.getItem(EMBEDDINGS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

export async function saveCachedEmbeddings(index) {
  if (!index) return false;
  if (globalThis.indexedDB) {
    try {
      await idbPut('embeddings', EMBEDDINGS_KEY, index);
      return true;
    } catch {
      // continue to localStorage fallback
    }
  }
  if (localStorageAvailable()) {
    try {
      localStorage.setItem(EMBEDDINGS_KEY, JSON.stringify(index));
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function getCachedQuery(query) {
  if (!query) return null;
  const key = `${QUERY_CACHE_KEY}:${query}`;
  if (globalThis.indexedDB) {
    try {
      const cached = await idbGet('queries', key);
      if (cached) return cached;
    } catch {
      // fallback below
    }
  }
  if (localStorageAvailable()) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

export async function saveCachedQuery(query, results) {
  if (!query) return false;
  const key = `${QUERY_CACHE_KEY}:${query}`;
  if (globalThis.indexedDB) {
    try {
      await idbPut('queries', key, results);
      return true;
    } catch {
      // try localStorage fallback
    }
  }
  if (localStorageAvailable()) {
    try {
      localStorage.setItem(key, JSON.stringify(results));
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function clearAll() {
  if (globalThis.indexedDB) {
    try {
      await idbClear('embeddings');
      await idbClear('queries');
    } catch {
      // ignore
    }
  }
  if (localStorageAvailable()) {
    try {
      localStorage.removeItem(EMBEDDINGS_KEY);
      for (let i = localStorage.length - 1; i >= 0; i -= 1) {
        const key = localStorage.key(i);
        if (key.startsWith(`${QUERY_CACHE_KEY}:`)) {
          localStorage.removeItem(key);
        }
      }
    } catch {
      // ignore
    }
  }
}
