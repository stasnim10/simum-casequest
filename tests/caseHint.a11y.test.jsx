/* @vitest-environment jsdom */

import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
describe('CaseHint accessibility', () => {
  beforeEach(() => {
    vi.resetModules();
    const store = {};
    const storage = {
      getItem: vi.fn((key) => (key in store ? store[key] : null)),
      setItem: vi.fn((key, value) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach((key) => delete store[key]);
      })
    };
    vi.stubGlobal('localStorage', storage);
    Object.defineProperty(window, 'localStorage', {
      value: storage,
      configurable: true
    });
  });

  it('focuses close button when dialog opens and restores focus to trigger on Escape', async () => {
    const user = userEvent.setup();

    const { default: CaseHint } = await import('../src/components/CaseHint.jsx');

    render(
      <CaseHint
        caseContext={{ id: 'test-case', type: 'profitability', step: 'framework' }}
        caseId="test-case"
        userProgress={{ hintsUsed: 0 }}
      />
    );

    const trigger = screen.getByRole('button', { name: /get hint/i });
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close hint/i });
    expect(closeBtn).toBeInTheDocument();

    await waitFor(() => {
      expect(document.activeElement).toBe(closeBtn);
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
  });
});
