import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Crown, CheckCircle } from 'lucide-react';
import useStore from '../state/store';
import { getModuleList, getLessonsByModule } from '../data/api';

export default function LearningPath() {
  const { lessonProgress } = useStore();
  const modules = getModuleList();

  const isModuleUnlocked = (module) => {
    if (!module.prereq) return true;
    
    const prereqModule = modules.find(m => m.id === module.prereq);
    if (!prereqModule) return true;
    
    const prereqLessons = getLessonsByModule(prereqModule.id);
    return prereqLessons.every(lesson => {
      const progress = lessonProgress[lesson.id];
      return progress && (progress.crownLevel >= 1 || progress.status === 'mastered');
    });
  };

  const isLessonUnlocked = (lesson, moduleLessons, moduleUnlocked) => {
    if (!moduleUnlocked) return false;
    
    const lessonIndex = moduleLessons.findIndex(l => l.id === lesson.id);
    if (lessonIndex === 0) return true;
    
    const prevLesson = moduleLessons[lessonIndex - 1];
    const prevProgress = lessonProgress[prevLesson.id];
    return prevProgress && (prevProgress.status === 'mastered' || prevProgress.crownLevel >= 1);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8">Learning Path</h2>
      
      <div className="space-y-12">
        {modules.map((module) => {
          const moduleLessons = getLessonsByModule(module.id);
          const moduleUnlocked = isModuleUnlocked(module);
          
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${!moduleUnlocked ? 'opacity-60' : ''}`}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
                    <p className="text-indigo-100">{module.summary}</p>
                    {module.prereq && !moduleUnlocked && (
                      <div className="flex items-center gap-2 mt-3 bg-white/20 rounded-lg px-3 py-2 w-fit">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">Complete previous module to unlock</span>
                      </div>
                    )}
                  </div>
                  {!moduleUnlocked && (
                    <Lock className="w-8 h-8" />
                  )}
                </div>
              </div>

              <div className="relative">
                {/* Connecting line */}
                <div className="absolute top-16 left-0 right-0 h-1 bg-gray-200 -z-10" />
                
                {/* Lesson nodes */}
                <div className="flex justify-between gap-4 overflow-x-auto pb-4">
                  {moduleLessons.map((lesson, index) => {
                    const progress = lessonProgress[lesson.id];
                    const crownLevel = progress?.crownLevel || 0;
                    const isMastered = progress?.status === 'mastered';
                    const isUnlocked = isLessonUnlocked(lesson, moduleLessons, moduleUnlocked);
                    
                    const NodeContent = (
                      <motion.div
                        whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
                        whileTap={isUnlocked ? { scale: 0.95 } : {}}
                        className={`relative flex flex-col items-center min-w-[140px] ${
                          !isUnlocked ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        {/* Node circle */}
                        <motion.div
                          animate={isMastered ? {
                            boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.4)', '0 0 0 10px rgba(34, 197, 94, 0)'],
                          } : {}}
                          transition={{ duration: 1.5, repeat: isMastered ? Infinity : 0 }}
                          className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${
                            !isUnlocked
                              ? 'bg-gray-100 border-gray-300'
                              : isMastered
                              ? 'bg-green-50 border-green-500'
                              : progress
                              ? 'bg-indigo-50 border-indigo-500'
                              : 'bg-white border-indigo-300'
                          }`}
                        >
                          {!isUnlocked ? (
                            <Lock className="w-8 h-8 text-gray-400" />
                          ) : isMastered ? (
                            <CheckCircle className="w-12 h-12 text-green-500" />
                          ) : (
                            <div className="text-4xl">
                              {index === 0 ? '📚' : index === 1 ? '🎯' : index === 2 ? '💡' : index === 3 ? '🚀' : '⭐'}
                            </div>
                          )}
                        </motion.div>

                        {/* Lesson title */}
                        <div className="mt-3 text-center">
                          <p className={`text-sm font-semibold ${!isUnlocked ? 'text-gray-400' : 'text-gray-900'}`}>
                            {lesson.title}
                          </p>
                          
                          {/* Crown chips */}
                          {isUnlocked && (
                            <div className="flex gap-1 justify-center mt-2">
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: i < crownLevel ? 1 : 0.7 }}
                                  transition={{ delay: i * 0.1 }}
                                >
                                  <Crown 
                                    className={`w-4 h-4 ${
                                      i < crownLevel 
                                        ? 'text-yellow-500 fill-yellow-500' 
                                        : 'text-gray-300'
                                    }`}
                                  />
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Progress indicator */}
                        {isUnlocked && progress && !isMastered && (
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                            <div className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                              In Progress
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );

                    return isUnlocked ? (
                      <Link key={lesson.id} to={`/lesson/${lesson.id}`}>
                        {NodeContent}
                      </Link>
                    ) : (
                      <div key={lesson.id}>
                        {NodeContent}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
