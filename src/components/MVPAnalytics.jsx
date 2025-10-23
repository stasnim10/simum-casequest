import { useMemo, useState } from 'react';
import { Activity, FileJson, PieChart, BarChart3 } from 'lucide-react';
import useStore from '../state/store';

export default function MVPAnalytics() {
  const { marketSizing } = useStore();
  const [showJson, setShowJson] = useState(false);

  const metrics = useMemo(() => {
    const completions = marketSizing.practiceAttempts.length;
    const averageScore = completions
      ? Math.round(
          marketSizing.practiceAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) /
            completions
        )
      : 0;
    const reviewRate = completions
      ? Math.round((marketSizing.reviewCount / completions) * 100)
      : 0;

    return {
      completions,
      averageScore,
      reviewRate,
      feedbackTaps: marketSizing.feedbackShown,
      hintsUsed: marketSizing.hintsUsed
    };
  }, [marketSizing]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">MVP Engagement Analytics</h3>
        </div>
        <button
          onClick={() => setShowJson(!showJson)}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
        >
          <FileJson className="w-4 h-4" />
          {showJson ? 'Hide JSON' : 'Show JSON'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricTile icon={Activity} label="Completions" value={metrics.completions} suffix="cases" />
        <MetricTile icon={PieChart} label="Avg Score" value={metrics.averageScore} suffix="/100" />
        <MetricTile icon={BarChart3} label="Review Rate" value={metrics.reviewRate} suffix="%" />
        <MetricTile icon={Activity} label="Feedback Taps" value={metrics.feedbackTaps} />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <span>Hints Served: <strong>{metrics.hintsUsed}</strong></span>
        <span>Reviews Opened: <strong>{marketSizing.reviewCount}</strong></span>
        <span>Mastery Unlocked: <strong>{marketSizing.masteryUnlocked ? 'Yes' : 'No'}</strong></span>
      </div>

      {showJson && (
        <pre className="mt-4 bg-gray-950 text-green-200 text-xs p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(
            {
              completions: metrics.completions,
              averageScore: metrics.averageScore,
              reviewRate: metrics.reviewRate,
              feedbackTaps: metrics.feedbackTaps,
              hintsUsed: metrics.hintsUsed,
              practiceAttempts: marketSizing.practiceAttempts
            },
            null,
            2
          )}
        </pre>
      )}
    </div>
  );
}

function MetricTile({ icon: Icon, label, value, suffix }) {
  return (
    <div className="bg-indigo-50 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="bg-white rounded-lg p-2 shadow-sm">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p className="text-xs uppercase text-indigo-500 tracking-wide">{label}</p>
          <p className="text-xl font-semibold text-gray-900">
            {value}
            {suffix ? <span className="text-sm text-gray-500 ml-1">{suffix}</span> : null}
          </p>
        </div>
      </div>
    </div>
  );
}
