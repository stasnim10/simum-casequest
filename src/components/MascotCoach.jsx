import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const moods = {
  encourage: {
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    emoji: '🧠'
  },
  celebrate: {
    gradient: 'from-emerald-500 via-teal-500 to-sky-500',
    emoji: '🎉'
  },
  focus: {
    gradient: 'from-slate-500 via-blue-500 to-indigo-500',
    emoji: '🧭'
  }
};

export default function MascotCoach({ message, subtext, mood = 'encourage', footer }) {
  const style = moods[mood] || moods.encourage;
  const bubbleId = useMemo(() => Math.random().toString(36).slice(2, 7), []);

  return (
    <motion.div
      layoutId={`coach-${bubbleId}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ type: 'spring', stiffness: 120, damping: 12 }}
      className="relative flex items-start gap-3 bg-white/80 backdrop-blur-lg border border-indigo-100 rounded-2xl p-4 shadow-sm"
    >
      <div className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-md`}> 
        <span className="text-3xl" role="img" aria-hidden>{style.emoji}</span>
      </div>
      <div className="flex-1 text-sm">
        <div className="flex items-center gap-2 text-indigo-700 font-semibold">
          <Sparkles className="w-4 h-4" />
          Coach Milo
        </div>
        <p className="text-gray-700 mt-1 leading-relaxed">{message}</p>
        {subtext ? <p className="text-xs text-gray-500 mt-2">{subtext}</p> : null}
        {footer ? <div className="mt-3 text-xs text-indigo-500 font-medium">{footer}</div> : null}
      </div>
    </motion.div>
  );
}
