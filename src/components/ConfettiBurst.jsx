import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const COLORS = ['#6366F1', '#F97316', '#10B981', '#F43F5E', '#0EA5E9'];

export default function ConfettiBurst({ active, duration = 1600, onDone }) {
  const [visible, setVisible] = useState(false);
  const particles = useMemo(() => {
    return Array.from({ length: 22 }).map((_, idx) => ({
      id: idx,
      color: COLORS[idx % COLORS.length],
      x: (Math.random() - 0.5) * 140,
      y: Math.random() * -90 - 60,
      rotate: (Math.random() - 0.5) * 160,
      scale: 0.6 + Math.random() * 0.9
    }));
  }, []);

  useEffect(() => {
    if (active) {
      setVisible(true);
      const timeout = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, duration);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [active, duration, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                initial={{
                  opacity: 1,
                  x: '50%',
                  y: '45%',
                  scale: 0.7
                }}
                animate={{
                  opacity: 0,
                  x: `calc(50% + ${particle.x}px)`,
                  y: `calc(45% + ${particle.y}px)`,
                  rotate: particle.rotate,
                  scale: particle.scale
                }}
                transition={{
                  duration: duration / 1000,
                  ease: 'ease-out'
                }}
                className="absolute w-3 h-3 rounded-sm"
                style={{ background: particle.color }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
