import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Flame, TrendingUp, Target, 
  CheckCircle, ArrowRight, Trophy 
} from 'lucide-react';
import analytics from '../services/analytics';

const SessionSummary = ({ 
  sessionData, 
  onContinue, 
  onClose,
  showCelebration = false,
  isFirstLesson = false
}) => {
  const {
    xpEarned = 0,
    streakMaintained = false,
    streakExtended = false,
    skillsImproved = [],
    nextRecommendation = null,
    sessionLength = 0,
    accuracy = 0
  } = sessionData;

  useEffect(() => {
    analytics.trackSummaryViewed(sessionData);
    
    if (isFirstLesson) {
      analytics.trackFirstLessonComplete(sessionLength * 60); // convert to seconds
    }
    
    if (streakExtended) {
      analytics.trackStreakComplete(sessionData.newStreakLength || 1);
    }
  }, [sessionData, isFirstLesson, streakExtended]);

  const handleContinue = () => {
    analytics.trackNextActionTaken('continue_from_summary');
    onContinue();
  };

  const handleClose = () => {
    analytics.trackNextActionTaken('close_summary');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
          >
            <Trophy className="h-10 w-10 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isFirstLesson ? 'Welcome to CaseQuest!' : 'Great Session!'}
          </h2>
          <p className="text-gray-600">{sessionLength} minutes well spent</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* XP Earned */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 rounded-xl p-4 text-center"
          >
            <Star className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">+{xpEarned}</p>
            <p className="text-sm text-gray-600">XP Earned</p>
          </motion.div>

          {/* Streak Status */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-orange-50 rounded-xl p-4 text-center"
          >
            <Flame className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">
              {streakExtended ? '🔥' : '✅'}
            </p>
            <p className="text-sm text-gray-600">
              {streakExtended ? 'Streak +1' : 'Maintained'}
            </p>
          </motion.div>

          {/* Accuracy */}
          {accuracy > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-green-50 rounded-xl p-4 text-center"
            >
              <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
              <p className="text-sm text-gray-600">Accuracy</p>
            </motion.div>
          )}

          {/* Skills Improved */}
          {skillsImproved.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-purple-50 rounded-xl p-4 text-center"
            >
              <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">+{skillsImproved.length}</p>
              <p className="text-sm text-gray-600">Skills</p>
            </motion.div>
          )}
        </div>

        {/* Skills Improved List */}
        {skillsImproved.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-6"
          >
            <h3 className="font-semibold text-gray-900 mb-3">Skills Strengthened:</h3>
            <div className="space-y-2">
              {skillsImproved.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">{skill.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {skill.oldStrength}% → {skill.newStrength}%
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next Recommendation */}
        {nextRecommendation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Up Next:</h3>
            <p className="text-sm text-gray-600 mb-3">{nextRecommendation}</p>
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Continue Learning <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {/* First lesson special message */}
        {isFirstLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="bg-yellow-50 rounded-xl p-4 mb-6"
          >
            <p className="text-sm text-yellow-800 text-center">
              🎉 <strong>Streak started!</strong> Come back tomorrow to keep it going.
            </p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
          >
            Done for Now
          </button>
          {nextRecommendation && (
            <button
              onClick={handleContinue}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium"
            >
              Keep Going
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SessionSummary;
