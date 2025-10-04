import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Lock, ArrowRight } from 'lucide-react';

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

// ModuleCard Sub-component
const ModuleCard = ({ module, isLocked }) => {
  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02 } : {}}
      className={`bg-white rounded-xl shadow-sm p-6 ${isLocked ? 'opacity-60' : 'hover:shadow-md'} transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{module.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{module.description}</p>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
              {module.difficulty}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {module.category}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              {module.xp_reward} XP
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {module.estimated_duration} min
            </div>
          </div>
        </div>
        
        {isLocked ? (
          <Lock className="h-6 w-6 text-gray-400" />
        ) : (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            Start
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Main LearningPath Component
const LearningPath = ({ modules, onNavigate }) => {
  // Sort modules by order_index before rendering
  const sortedModules = [...modules].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Path</h1>
          <p className="text-gray-600">Master consulting skills through structured modules</p>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-blue-600 hover:text-blue-700"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      <div className="grid gap-6">
        {sortedModules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            isLocked={false} // Hardcoded to false as per instructions
          />
        ))}
      </div>
    </div>
  );
};

export default LearningPath;
