import React from 'react';

type Props = {
  data: {
    strengths?: string[];
    gaps?: string[];
    actionItems?: string[];
    scorecard?: { structuring:number; quant:number; insight:number; communication:number; overall:number };
    cached?: boolean;
  } | null;
  error?: string | null;
  loading?: boolean;
  onClose?: () => void;
};

function ScoreBar({ label, value }:{label:string; value:number}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded">
        <div className="h-2 rounded bg-blue-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function FeedbackPanel({ data, error, loading, onClose }: Props) {
  return (
    <div className="p-4 md:p-6 rounded-2xl shadow-lg border bg-white max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">AI Coach Feedback</h3>
        {onClose ? (
          <button onClick={onClose} className="text-sm px-3 py-1 rounded-full border hover:bg-gray-50">Close</button>
        ) : null}
      </div>

      {loading ? <p className="text-sm">Analyzing your case. This can take a few seconds.</p> : null}
      {error ? <p className="text-sm text-red-600">Error: {error}</p> : null}

      {!loading && !error && data ? (
        <div className="space-y-4">
          {data?.cached ? <div className="text-xs text-gray-500">Result served from cache</div> : null}

          {data?.scorecard ? (
            <div>
              <h4 className="font-medium mb-2">Scorecard</h4>
              <ScoreBar label="Structuring" value={data.scorecard.structuring} />
              <ScoreBar label="Quant" value={data.scorecard.quant} />
              <ScoreBar label="Insight" value={data.scorecard.insight} />
              <ScoreBar label="Communication" value={data.scorecard.communication} />
              <ScoreBar label="Overall" value={data.scorecard.overall} />
            </div>
          ) : null}

          {data?.strengths?.length ? (
            <div>
              <h4 className="font-medium">Strengths</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {data.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          ) : null}

          {data?.gaps?.length ? (
            <div>
              <h4 className="font-medium">Gaps</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {data.gaps.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </div>
          ) : null}

          {data?.actionItems?.length ? (
            <div>
              <h4 className="font-medium">Action Items</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {data.actionItems.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
