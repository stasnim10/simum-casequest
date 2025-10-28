import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, Star, Trophy } from 'lucide-react';
import useStore from '../state/store';
import { getModuleList, getLessonsByModule } from '../data/api';

export default function ProgressOverview() {
  const { user, lessonProgress } = useStore();

  const stats = useMemo(() => {
    const modules = getModuleList();
    const totalLessons = modules.reduce(
      (sum, module) => sum + getLessonsByModule(module.id).length,
      0
    );
    const completedLessons = Object.values(lessonProgress).filter((progress) =>
      progress && (progress.status === 'mastered' || progress.crownLevel >= 1)
    ).length;

    return {
      totalLessons,
      completedLessons,
      badges: user.badges.length,
      streak: user.streak,
      xp: user.xp
    };
  }, [lessonProgress, user.badges.length, user.streak, user.xp]);

  return (
    <div className="min-h-screen px-4 pt-6 pb-24 bg-gradient-to-br from-slate-50 via-white to-indigo-100">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Your progress</h1>
          <p className="text-sm text-gray-600">Celebrate wins and see what to tackle next.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <ProgressCard
            icon={<Flame className="w-6 h-6" />}
            title="Daily streak"
            value={`${stats.streak} days`}
            description="Keep showing up daily to stay sharp."
          />
          <ProgressCard
            icon={<Star className="w-6 h-6" />}
            title="Total XP"
            value={`${stats.xp}`}
            description="XP grows every time you complete a micro-lesson."
          />
          <ProgressCard
            icon={<Award className="w-6 h-6" />}
            title="Lessons completed"
            value={`${stats.completedLessons}/${stats.totalLessons}`}
            description="Every finished lesson unlocks the next one."
          />
          <ProgressCard
            icon={<Trophy className="w-6 h-6" />}
            title="Badges collected"
            value={`${stats.badges}`}
            description="Badges mark big milestones—keep collecting!"
          />
        </motion.div>

        <div className="bg-white rounded-3xl shadow-lg p-6 border border-indigo-100">
          <h2 className="text-lg font-semibold text-indigo-900">Tips to keep momentum</h2>
          <ul className="list-disc list-inside text-sm text-gray-600 mt-3 space-y-2">
            <li>Finish one micro-lesson every day to keep your streak alive.</li>
            <li>Use Quick Practice when you only have a couple of minutes.</li>
            <li>Replay completed lessons to reinforce tricky concepts.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ProgressCard({ icon, title, value, description }) {
  return (
    <div className="rounded-3xl bg-white shadow-lg border border-indigo-100 p-5 flex flex-col gap-2">
      <div className="flex items-center gap-3 text-indigo-600 font-medium">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          {icon}
        </div>
        <span>{title}</span>
      </div>
      <span className="text-2xl font-semibold text-gray-900">{value}</span>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
