export default function MiloExplains({ term, definition, label = 'Milo explains' }) {
  if (!term || !definition) return null;

  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-500">
        {label}
      </p>
      <div className="mt-1 flex items-start gap-3">
        <span className="text-2xl" role="img" aria-hidden>
          🪄
        </span>
        <div>
          <p className="text-sm font-semibold text-indigo-900">{term}</p>
          <p className="text-sm text-indigo-800 mt-1 leading-relaxed">{definition}</p>
        </div>
      </div>
    </div>
  );
}
