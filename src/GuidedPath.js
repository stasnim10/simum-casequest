import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Play } from 'lucide-react';

const GuidedPath = ({ lessons, userProgress, onStartLesson }) => {
  const lessonsByUnit = lessons.reduce((acc, lesson) => {
    (acc[lesson.unit] = acc[lesson.unit] || []).push(lesson);
    return acc;
  }, {});

  let lessonCounter = 0;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
          Guided Mastery Path
        </h1>
        <p className="mt-2 text-md sm:text-lg text-gray-500">
          Complete lessons in order to unlock new challenges and skills.
        </p>
      </div>

      {Object.entries(lessonsByUnit).map(([unit, unitLessons]) => (
        <div key={unit} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 border-b pb-2 mb-6">{unit}</h2>
          <div className="space-y-4">
            {unitLessons.sort((a, b) => a.order_index - b.order_index).map((lesson, index) => {
              lessonCounter++;
              const isCompleted = userProgress?.completed_lessons?.includes(lesson.id);
              const isActive = userProgress?.completed_lessons?.length === lessonCounter - 1;
              const isLocked = userProgress?.completed_lessons?.length < lessonCounter - 1;
              const canAccess = isCompleted || isActive || !isLocked;

              let statusIcon;
              if (isCompleted) {
                statusIcon = <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center"><Check size={18} /></div>;
              } else if (isActive) {
                statusIcon = <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"><Play size={18} /></div>;
              } else {
                statusIcon = <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center"><Lock size={18} /></div>;
              }

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center p-4 rounded-lg transition-all ${
                    isActive ? 'bg-white shadow-md' : isCompleted ? 'bg-green-50' : 'bg-gray-100'
                  }`}
                >
                  <div className="mr-4">{statusIcon}</div>
                  <div className="flex-grow">
                    <h3 className={`font-semibold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>{lesson.title}</h3>
                    <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>{lesson.xp_reward} XP</p>
                  </div>
                  {canAccess && (
                    <button
                      onClick={() => onStartLesson(lesson)}
                      className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
                        isCompleted 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isCompleted ? 'Review' : 'Start'}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GuidedPath;
