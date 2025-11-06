import {
  loadCachedEmbeddings,
  saveCachedEmbeddings,
  getCachedQuery,
  saveCachedQuery
} from './embeddingsCache.js';

let embeddingsIndex = null;
let modelSession = null;
let ort = null;

export async function loadPrecomputedEmbeddings(
  url = '/data/embeddings.json',
  { forceReload = false } = {}
) {
  if (embeddingsIndex && !forceReload) return embeddingsIndex;

  if (!forceReload) {
    try {
      const cached = await loadCachedEmbeddings();
      if (cached) {
        embeddingsIndex = cached;
        return embeddingsIndex;
      }
    } catch {
      // ignore and fallback to fetch
    }
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch embeddings at ${url}: ${response.status}`);
  }
  embeddingsIndex = await response.json();

  try {
    await saveCachedEmbeddings(embeddingsIndex);
  } catch {
    // non-fatal
  }

  return embeddingsIndex;
}

export function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function searchEmbeddings(queryEmbedding, index = embeddingsIndex, topK = 5) {
  if (!index || index.length === 0) return [];
  const scored = index.map((item) => ({
    id: item.id,
    text: item.text,
    meta: item.meta || {},
    score: cosine(queryEmbedding, item.embedding)
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

export async function loadCachedSearch(query) {
  try {
    return await getCachedQuery(query);
  } catch {
    return null;
  }
}

export async function saveSearchCache(query, results) {
  try {
    await saveCachedQuery(query, results);
  } catch {
    // ignore
  }
}

export async function initOnnxRuntimeWeb() {
  if (modelSession) return modelSession;
  ort = await import('onnxruntime-web');
  return ort;
}

export async function computeEmbeddingInBrowser() {
  if (!ort) await initOnnxRuntimeWeb();
  if (!modelSession) {
    throw new Error(
      'ONNX model session not created. Use ort.InferenceSession.create(...) to load a model and set modelSession.'
    );
  }
  throw new Error(
    'computeEmbeddingInBrowser is a placeholder. Implement tokenizer conversion and set modelSession.'
  );
}
