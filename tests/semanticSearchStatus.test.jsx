/* @vitest-environment jsdom */

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

vi.mock('../src/services/embeddingsService.js', () => {
  const loadPrecomputedEmbeddings = vi.fn().mockResolvedValue([]);
  const searchEmbeddings = vi.fn().mockReturnValue([]);
  const loadCachedSearch = vi.fn().mockResolvedValue(null);
  const saveSearchCache = vi.fn().mockResolvedValue(undefined);
  return {
    loadPrecomputedEmbeddings,
    searchEmbeddings,
    loadCachedSearch,
    saveSearchCache
  };
});

vi.mock('../src/services/embeddingsCache.js', () => ({
  clearAll: vi.fn().mockResolvedValue(true)
}));

vi.mock('onnxruntime-web', () => ({}), { virtual: true });

describe('SemanticSearch status', () => {
  it('shows ready status after embeddings load', async () => {
    const { default: SemanticSearch } = await import('../src/components/SemanticSearch.jsx');
    render(<SemanticSearch />);

    await waitFor(() =>
      expect(screen.getByText(/Embeddings ready/i)).toBeInTheDocument()
    );
  });

  it('refresh button clears cache and reloads embeddings', async () => {
    const { loadPrecomputedEmbeddings } = await import('../src/services/embeddingsService.js');
    const { clearAll } = await import('../src/services/embeddingsCache.js');
    const { default: SemanticSearch } = await import('../src/components/SemanticSearch.jsx');
    const user = userEvent.setup();

    render(<SemanticSearch />);
    const buttons = await screen.findAllByRole('button', { name: /refresh embeddings/i });
    expect(buttons.length).toBeGreaterThan(0);
    await user.click(buttons[0]);

    expect(clearAll).toHaveBeenCalled();
    expect(loadPrecomputedEmbeddings).toHaveBeenLastCalledWith('/data/embeddings.json', {
      forceReload: true
    });
  });
});
