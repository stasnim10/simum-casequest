import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock } from 'lucide-react';

const SessionProgress = ({ 
  steps, 
  currentStep, 
  timeRemaining = null,
  showTimeEstimate = true 
}) => {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">
            Step {currentStep + 1} of {steps.length}
          </h3>
          <p className="text-sm text-gray-600">
            {steps[currentStep]?.title || 'In Progress'}
          </p>
        </div>
        {showTimeEstimate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              {timeRemaining 
                ? `${Math.ceil(timeRemaining)} min left`
                : `~${steps.length - currentStep - 1} min remaining`
              }
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>{Math.round(progress)}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: index === currentStep ? 1.2 : 1,
                color: index <= currentStep ? '#10B981' : '#9CA3AF'
              }}
              className="mb-2"
            >
              {index < currentStep ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : index === currentStep ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Circle className="h-6 w-6 text-blue-500" />
                </motion.div>
              ) : (
                <Circle className="h-6 w-6 text-gray-400" />
              )}
            </motion.div>
            <span className={`text-xs text-center max-w-16 ${
              index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'
            }`}>
              {step.shortTitle || step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Current Step Description */}
      {steps[currentStep]?.description && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            {steps[currentStep].description}
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionProgress;
