import { Link } from 'react-router-dom';
import { Lock, CheckCircle, Circle, Crown } from 'lucide-react';
import { getModuleList, getLessonsByModule } from '../data/api';
import useStore from '../state/store';

export default function LearningPath() {
  const modules = getModuleList();
  const { lessonProgress } = useStore();

  const isModuleUnlocked = (module) => {
    if (!module.prereq) return true;
    const prereqModule = modules.find((m) => m.id === module.prereq);
    if (!prereqModule) return true;
    
    // Check if all lessons in prereq module are mastered
    const prereqLessons = getLessonsByModule(prereqModule.id);
    return prereqLessons.every((lesson) => {
      const progress = lessonProgress[lesson.id];
      return progress && progress.status === 'mastered';
    });
  };

  const isLessonUnlocked = (lesson, moduleId) => {
    const moduleLessons = getLessonsByModule(moduleId);
    const lessonIndex = moduleLessons.findIndex((l) => l.id === lesson.id);
    
    // First lesson is always unlocked if module is unlocked
    if (lessonIndex === 0) return true;
    
    // Check if previous lesson is mastered
    const prevLesson = moduleLessons[lessonIndex - 1];
    const prevProgress = lessonProgress[prevLesson.id];
    return prevProgress && prevProgress.status === 'mastered';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Learning Path</h1>
      
      {modules.map((module) => {
        const moduleUnlocked = isModuleUnlocked(module);
        const moduleLessons = getLessonsByModule(module.id);

        return (
          <div key={module.id} className="mb-8">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{module.title}</h2>
              <p className="text-gray-600">{module.summary}</p>
              {!moduleUnlocked && (
                <p className="text-sm text-orange-600 mt-1">
                  🔒 Complete previous module to unlock
                </p>
              )}
            </div>

            <div className="space-y-3">
              {moduleLessons.map((lesson) => {
                const progress = lessonProgress[lesson.id] || { status: 'new', crownLevel: 0 };
                const unlocked = moduleUnlocked && isLessonUnlocked(lesson, module.id);
                const isMastered = progress.status === 'mastered';

                return (
                  <Link
                    key={lesson.id}
                    to={unlocked ? `/lesson/${lesson.id}` : '#'}
                    className={`block p-4 rounded-lg border transition-all ${
                      isMastered
                        ? 'bg-green-50 border-green-200'
                        : progress.status === 'in_progress'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200'
                    } ${
                      unlocked
                        ? 'hover:shadow-md cursor-pointer'
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {!unlocked ? (
                          <Lock className="w-5 h-5 text-gray-400" />
                        ) : isMastered ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-blue-600" />
                        )}
                        <span className="font-medium text-gray-900">{lesson.title}</span>
                      </div>
                      
                      {progress.crownLevel > 0 && (
                        <div className="flex items-center gap-1">
                          {[...Array(progress.crownLevel)].map((_, i) => (
                            <Crown key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
