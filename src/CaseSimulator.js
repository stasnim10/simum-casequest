import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// Helper function to determine badge color based on difficulty
const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// CaseCard Sub-component
const CaseCard = ({ caseStudy }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{caseStudy.title}</h3>
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(caseStudy.difficulty)}`}>
              {caseStudy.difficulty}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {caseStudy.industry}
            </span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-3">{caseStudy.case_prompt}</p>
        </div>
        <ChevronRight className="h-6 w-6 text-gray-400 ml-4" />
      </div>
    </motion.div>
  );
};

// Main CaseSimulator Component
const CaseSimulator = ({ cases, onNavigate }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Simulator</h1>
          <p className="text-gray-600">Practice with real consulting case studies</p>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-blue-600 hover:text-blue-700"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      <div className="grid gap-6">
        {cases.map((caseStudy) => (
          <CaseCard
            key={caseStudy.id}
            caseStudy={caseStudy}
          />
        ))}
      </div>
    </div>
  );
};

export default CaseSimulator;
