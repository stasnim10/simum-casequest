import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  loadPrecomputedEmbeddings,
  searchEmbeddings,
  loadCachedSearch,
  saveSearchCache
} from '../services/embeddingsService.js';
import { clearAll as clearEmbeddingsCache } from '../services/embeddingsCache.js';

function naiveQueryEmbedding(text) {
  const length = 384;
  const vector = new Array(length).fill(0);
  for (let i = 0; i < text.length && i < 2048; i += 1) {
    vector[i % length] += text.charCodeAt(i) % 23;
  }
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / norm);
}

export default function SemanticSearch({
  embeddingsUrl = '/data/embeddings.json',
  topK = 5,
  onResultClick
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('Initializing…');
  const [indexReady, setIndexReady] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastLoadedAt, setLastLoadedAt] = useState(null);

  const formattedLastLoaded = useMemo(() => {
    if (!lastLoadedAt) return '';
    return lastLoadedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [lastLoadedAt]);

  const bootstrapEmbeddings = useCallback(
    async (options = {}) => {
      setStatus(options.forceReload ? 'Refreshing embeddings…' : 'Loading embeddings…');
      try {
        await loadPrecomputedEmbeddings(embeddingsUrl, options);
        setIndexReady(true);
        setStatus('Embeddings ready.');
        setLastLoadedAt(new Date());
      } catch (error) {
        console.error('Failed to load embeddings', error);
        setStatus('Failed to load embeddings. Check console for details.');
      }
    },
    [embeddingsUrl]
  );

  useEffect(() => {
    bootstrapEmbeddings();
  }, [bootstrapEmbeddings]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await clearEmbeddingsCache();
      await bootstrapEmbeddings({ forceReload: true });
    } finally {
      setRefreshing(false);
    }
  }, [bootstrapEmbeddings]);

  const handleSearch = async (event) => {
    event?.preventDefault();
    if (!query.trim()) return;
    setLoadingSearch(true);
    setStatus('Checking cached results…');

    try {
      const cached = await loadCachedSearch(query.trim());
      if (cached) {
        setResults(cached);
        setStatus('Showing cached results.');
        setLoadingSearch(false);
        return;
      }

      const queryEmbedding = naiveQueryEmbedding(query.trim());
      setStatus('Searching embeddings…');
      const searchResults = searchEmbeddings(queryEmbedding, undefined, topK);
      setResults(searchResults);
      setStatus(`Found ${searchResults.length} item(s).`);
      await saveSearchCache(query.trim(), searchResults);
    } catch (error) {
      console.error('Semantic search failed', error);
      setStatus('Search error. Try again.');
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Ask Milo</h3>
          <p className="text-xs text-slate-500">
            {status}
            {formattedLastLoaded && status.includes('Embeddings') && ` (cached ${formattedLastLoaded})`}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={!indexReady || refreshing}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:text-slate-400"
        >
          {refreshing ? 'Refreshing…' : 'Refresh embeddings'}
        </button>
      </div>

      <form onSubmit={handleSearch} className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask about market sizing, profitability, frameworks…"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200"
          disabled={!indexReady}
          aria-label="Search learning content"
        />
        <button
          type="submit"
          disabled={!indexReady || loadingSearch}
          className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-600 disabled:bg-slate-300"
        >
          {loadingSearch ? 'Searching…' : 'Search'}
        </button>
      </form>

      {results.length > 0 && (
        <ul className="mt-4 space-y-2">
          {results.map((result) => (
            <li
              key={result.id}
              className="cursor-pointer rounded-lg border border-slate-100 px-3 py-2 text-sm hover:bg-slate-50"
              onClick={() => onResultClick?.(result)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onResultClick?.(result);
                }
              }}
              role={onResultClick ? 'button' : undefined}
              tabIndex={onResultClick ? 0 : undefined}
            >
              <p className="font-medium text-slate-900">
                {result.meta?.title || result.text?.slice(0, 80) || result.id}
              </p>
              {result.meta?.module && (
                <p className="text-xs text-slate-500">{result.meta.module}</p>
              )}
              <p className="text-xs text-slate-400">score {result.score.toFixed(3)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
