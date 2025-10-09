import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, RefreshCw, Target, Clock, 
  TrendingUp, Play, ArrowRight 
} from 'lucide-react';
import remoteConfig from '../services/remoteConfig';
import analytics from '../services/analytics';

const NextBestAction = ({ userStats, weakAreas, onAction }) => {
  const getNextAction = () => {
    const policy = remoteConfig.getNextActionPolicy();
    const graceHours = remoteConfig.getStreakGraceHours();
    const timeAvailable = userStats.dailyGoalMinutes || 10;
    
    const now = new Date();
    const lastActivity = userStats.lastActiveAt ? new Date(userStats.lastActiveAt) : null;
    const hoursSinceActivity = lastActivity ? (now - lastActivity) / (1000 * 60 * 60) : 24;
    
    // Streak at risk (within grace period)
    if (hoursSinceActivity > (24 - graceHours / 24 * 24)) {
      return {
        type: 'streak_save',
        title: 'Save Your Streak!',
        description: `Quick ${Math.min(timeAvailable, 5)}-min lesson to keep your ${userStats.streak || 0}-day streak`,
        icon: Target,
        color: 'red',
        urgency: 'high',
        action: () => onAction('quick_lesson')
      };
    }
    
    // Policy-based recommendation
    if (policy === 'weakness_first' && weakAreas?.length > 0) {
      const weakestArea = weakAreas[0];
      return {
        type: 'review',
        title: 'Strengthen Weak Spot',
        description: `Review ${weakestArea.name} - ${weakestArea.strength || 0}% mastery`,
        icon: RefreshCw,
        color: 'orange',
        urgency: 'medium',
        action: () => onAction('review', weakestArea)
      };
    }
    
    // Time budget first or fallback
    if (userStats.currentModule) {
      return {
        type: 'continue',
        title: 'Continue Learning',
        description: `Module ${userStats.currentModule.number}: ${userStats.currentModule.name}`,
        icon: BookOpen,
        color: 'blue',
        urgency: 'low',
        action: () => onAction('continue_module')
      };
    }
    
    return {
      type: 'new_case',
      title: 'Try a New Case',
      description: 'Practice with a fresh consulting case study',
      icon: Play,
      color: 'green',
      urgency: 'low',
      action: () => onAction('new_case')
    };
  };

  const nextAction = getNextAction();
  
  useEffect(() => {
    analytics.trackNextActionShown(nextAction.type, nextAction.urgency);
  }, [nextAction.type, nextAction.urgency]);

  const handleActionClick = () => {
    analytics.trackNextActionTaken(nextAction.type);
    nextAction.action();
  };

  const urgencyColors = {
    high: 'from-red-500 to-red-600',
    medium: 'from-orange-500 to-orange-600',
    low: 'from-blue-500 to-blue-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleActionClick}
        className={`bg-gradient-to-r ${urgencyColors[nextAction.urgency]} rounded-2xl p-6 text-white cursor-pointer shadow-lg hover:shadow-xl transition-all`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <nextAction.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">{nextAction.title}</h3>
              <p className="text-white text-opacity-90">{nextAction.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">~{userStats.dailyGoalMinutes || 10} min</span>
              </div>
            </div>
          </div>
          <motion.div
            whileHover={{ x: 5 }}
            className="p-2"
          >
            <ArrowRight className="h-6 w-6" />
          </motion.div>
        </div>
        
        {nextAction.urgency === 'high' && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-3 text-sm font-medium"
          >
            ⚡ Time sensitive - don't lose your streak!
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default NextBestAction;
