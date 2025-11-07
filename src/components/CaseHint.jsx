import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hintService } from '../services/hintService.js';
import useStore from '../state/store.js';
import { track } from '../lib/analytics';

const baseButtonClass =
  'inline-flex items-center justify-center rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2';

export default function CaseHint({ caseContext = {}, caseId = 'profitability-case-1', userProgress = {} }) {
  const [open, setOpen] = useState(false);
  const [hintText, setHintText] = useState('');
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastFocusedElementRef = useRef(null);

  const trackHintUsage = useStore((state) => state.trackHintUsage);
  const getHintUsage = useStore((state) => state.getHintUsage);

  const hintCategory = useMemo(
    () => hintService.getCategoryFromContext(caseContext),
    [caseContext]
  );

  const closeDialog = useCallback(
    (source) => {
      if (source) {
        track('hint.dismiss', {
          caseId,
          source,
          category: hintCategory
        });
      }
      setOpen(false);
    },
    [caseId, hintCategory]
  );

  const fetchHint = (showMultiple = false) => {
    setLoading(true);
    try {
      const hintsUsed = getHintUsage(caseId) || 0;
      const progress = { ...userProgress, hintsUsed };

      if (showMultiple) {
        const hints = hintService.getMoreHints(caseContext, progress, 3);
        setHintText(hints.join('\n\n'));
        trackHintUsage(caseId, 'more_hints');
        track('hint.more', { caseId, category: hintCategory, count: hints.length });
      } else {
        const hint = hintService.getHint(caseContext, progress);
        setHintText(hint);
        trackHintUsage(caseId, hint);
        track('hint.request', { caseId, category: hintCategory });
      }
      setOpen(true);
    } catch (error) {
      console.error('Failed to fetch hint', error);
      track('hint.error', {
        caseId,
        message: error instanceof Error ? error.message : 'unknown'
      });
      setHintText("Milo hit a snag finding a hint. Try reframing the question and we'll regroup.");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    lastFocusedElementRef.current = document.activeElement;

    const focusTarget = closeButtonRef.current;
    if (focusTarget) {
      focusTarget.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDialog('escape-key');
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (
        lastFocusedElementRef.current &&
        typeof lastFocusedElementRef.current.focus === 'function'
      ) {
        lastFocusedElementRef.current.focus();
      }
    };
  }, [open, closeDialog]);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => fetchHint(false)}
        disabled={loading}
        className={`${baseButtonClass} bg-teal-500 px-3 py-2 text-sm text-white hover:bg-teal-600 focus:ring-teal-400`}
      >
        {loading ? 'Milo thinking…' : 'Get Hint'}
      </button>
      <button
        type="button"
        onClick={() => fetchHint(true)}
        disabled={loading}
        className={`${baseButtonClass} bg-amber-200 px-3 py-2 text-sm text-slate-900 hover:bg-amber-300 focus:ring-amber-400`}
      >
        More
      </button>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`milo-hint-title-${caseId}`}
          className="fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-2xl border border-indigo-100 bg-white p-4 shadow-xl focus:outline-none"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500 text-lg font-semibold text-white">
              M
            </div>
            <div className="flex-1">
              <p id={`milo-hint-title-${caseId}`} className="font-semibold text-slate-900">
                Coach Milo
              </p>
              <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed mt-2">{hintText}</p>
            </div>
            <button
              type="button"
              aria-label="Close hint"
              onClick={() => closeDialog('close-button')}
              ref={closeButtonRef}
              className="text-slate-400 transition hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                track('hint.used', {
                  caseId,
                  category: hintCategory
                });
                closeDialog('confirm-button');
              }}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
