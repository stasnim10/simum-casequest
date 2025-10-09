import React from 'react';
import { motion } from 'framer-motion';

const CelebrationAnimation = ({ onComplete }) => {
  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 0.5,
    rotation: Math.random() * 360,
    color: ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444'][Math.floor(Math.random() * 5)]
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    >
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ 
            x: `${piece.x}vw`, 
            y: '-10vh',
            rotate: 0,
            opacity: 1
          }}
          animate={{ 
            y: '110vh',
            rotate: piece.rotation,
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'linear'
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </motion.div>
  );
};

export default CelebrationAnimation;
