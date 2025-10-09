import React from 'react';

export default function FeedbackPanel({ feedback }) {
  if (!feedback) return null;
  const { strengths = [], gaps = [], actionItems = [], scorecard = {} } = feedback;
  return (
    <div className="border rounded-2xl p-4 bg-white shadow-sm mt-6">
      <h3 className="font-semibold text-lg mb-2">AI Feedback</h3>
      <div className="mb-2"><strong>Strengths:</strong>
        <ul className="list-disc ml-5 text-gray-700">
          {strengths.map((s,i)=><li key={i}>{s}</li>)}
        </ul>
      </div>
      <div className="mb-2"><strong>Gaps:</strong>
        <ul className="list-disc ml-5 text-gray-700">
          {gaps.map((g,i)=><li key={i}>{g}</li>)}
        </ul>
      </div>
      <div className="mb-2"><strong>Action Items:</strong>
        <ul className="list-disc ml-5 text-gray-700">
          {actionItems.map((a,i)=><li key={i}>{a}</li>)}
        </ul>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        Score: {scorecard.overall || '--'}
      </div>
    </div>
  );
}
