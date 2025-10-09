import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CaseMascot = ({ mood = 'happy', message, size = 'md' }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  const sizes = { sm: 60, md: 80, lg: 120 };
  const mascotSize = sizes[size];

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3000 + Math.random() * 2000);

    const idleInterval = setInterval(() => {
      setIsIdle(true);
      setTimeout(() => setIsIdle(false), 500);
    }, 5000 + Math.random() * 3000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(idleInterval);
    };
  }, []);

  const moods = {
    happy: { color: '#10B981', eyeY: 0, mouthPath: 'M 30 45 Q 40 55 50 45', bounce: true },
    excited: { color: '#F59E0B', eyeY: -2, mouthPath: 'M 25 40 Q 40 60 55 40', bounce: true },
    thinking: { color: '#3B82F6', eyeY: -5, mouthPath: 'M 35 50 L 45 50', bounce: false },
    sad: { color: '#6B7280', eyeY: 2, mouthPath: 'M 30 55 Q 40 45 50 55', bounce: false },
    celebrating: { color: '#8B5CF6', eyeY: -3, mouthPath: 'M 25 40 Q 40 65 55 40', bounce: true }
  };

  const currentMood = moods[mood] || moods.happy;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={currentMood.bounce ? {
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        } : isIdle ? { rotate: [0, -3, 3, 0] } : {}}
        transition={{
          duration: currentMood.bounce ? 0.6 : 2,
          repeat: currentMood.bounce ? Infinity : 0,
          repeatDelay: currentMood.bounce ? 2 : 0
        }}
      >
        <svg width={mascotSize} height={mascotSize} viewBox="0 0 80 80">
          {/* Body */}
          <motion.circle
            cx="40"
            cy="40"
            r="35"
            fill={currentMood.color}
            animate={{ scale: currentMood.bounce ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.6, repeat: currentMood.bounce ? Infinity : 0 }}
          />
          
          {/* Eyes */}
          <motion.ellipse
            cx="30"
            cy={25 + currentMood.eyeY}
            rx="4"
            ry={isBlinking ? 1 : 6}
            fill="white"
            animate={{ scaleY: isBlinking ? 0.1 : 1 }}
          />
          <motion.ellipse
            cx="50"
            cy={25 + currentMood.eyeY}
            rx="4"
            ry={isBlinking ? 1 : 6}
            fill="white"
            animate={{ scaleY: isBlinking ? 0.1 : 1 }}
          />
          
          {/* Pupils */}
          {!isBlinking && (
            <>
              <circle cx="30" cy={27 + currentMood.eyeY} r="2" fill="#1F2937" />
              <circle cx="50" cy={27 + currentMood.eyeY} r="2" fill="#1F2937" />
            </>
          )}
          
          {/* Mouth */}
          <motion.path
            d={currentMood.mouthPath}
            stroke="white"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            animate={mood === 'celebrating' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3, repeat: mood === 'celebrating' ? Infinity : 0 }}
          />
          
          {/* Sparkles for celebrating */}
          {mood === 'celebrating' && (
            <>
              <motion.circle
                cx="15"
                cy="15"
                r="2"
                fill="#FCD34D"
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.circle
                cx="65"
                cy="20"
                r="2"
                fill="#FCD34D"
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
              />
              <motion.circle
                cx="70"
                cy="50"
                r="2"
                fill="#FCD34D"
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
              />
            </>
          )}
        </svg>
      </motion.div>
      
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 bg-white px-4 py-2 rounded-full shadow-md text-sm font-medium text-gray-700"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CaseMascot;
