import { Bot } from 'lucide-react';

export default function CaseSimulator() {
  const cases = [
    { id: 1, title: 'Market Sizing', difficulty: 'Beginner' },
    { id: 2, title: 'Profitability Analysis', difficulty: 'Intermediate' },
    { id: 3, title: 'Market Entry', difficulty: 'Advanced' },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Case Simulator</h1>
      <div className="grid gap-4">
        {cases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{caseItem.title}</h3>
                  <span className="text-sm text-gray-500">{caseItem.difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
