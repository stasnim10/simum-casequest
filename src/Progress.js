import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Target, Award, Calendar, 
  BookOpen, Trophy, Star, Flame 
} from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  </motion.div>
);

const ProgressBar = ({ label, current, total, color = "blue" }) => {
  const percentage = Math.min((current / total) * 100, 100);
  
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{current}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`bg-${color}-600 h-2 rounded-full`}
        />
      </div>
    </div>
  );
};

const SkillRadar = ({ skills }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Assessment</h3>
    <div className="space-y-4">
      {skills.map((skill, index) => (
        <div key={index}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">{skill.name}</span>
            <span className="text-gray-500">{skill.level}/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(skill.level / 5) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="p-2 bg-blue-100 rounded-lg">
            <activity.icon className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
            <p className="text-xs text-gray-500">{activity.date}</p>
          </div>
          <span className="text-xs font-medium text-green-600">+{activity.xp} XP</span>
        </div>
      ))}
    </div>
  </div>
);

const Progress = ({ user, lessons }) => {
  const completedLessons = user?.completed_lessons?.length || 0;
  const totalLessons = lessons?.length || 10;
  const currentLevel = user?.current_level || 1;
  const totalXP = user?.total_xp || 0;
  const xpForNextLevel = currentLevel * 100;
  const currentLevelXP = totalXP % 100;

  const skills = [
    { name: 'Problem Structuring', level: Math.min(Math.floor(completedLessons / 2) + 1, 5) },
    { name: 'Market Analysis', level: Math.min(Math.floor(completedLessons / 3) + 1, 5) },
    { name: 'Financial Modeling', level: Math.min(Math.floor(completedLessons / 4) + 1, 5) },
    { name: 'Communication', level: Math.min(Math.floor(completedLessons / 2) + 2, 5) },
    { name: 'Strategic Thinking', level: Math.min(Math.floor(completedLessons / 3) + 1, 5) }
  ];

  const recentActivities = [
    { icon: BookOpen, title: 'Completed Market Sizing Lesson', date: '2 hours ago', xp: 50 },
    { icon: Trophy, title: 'Achieved 7-day streak', date: '1 day ago', xp: 25 },
    { icon: Target, title: 'Finished Profitability Case', date: '2 days ago', xp: 75 },
    { icon: Award, title: 'Reached Level ' + currentLevel, date: '3 days ago', xp: 100 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-gray-600">Track your learning journey and skill development</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={TrendingUp}
          title="Total XP"
          value={totalXP.toLocaleString()}
          subtitle={`Level ${currentLevel}`}
          color="blue"
        />
        <StatCard
          icon={BookOpen}
          title="Lessons Completed"
          value={completedLessons}
          subtitle={`${totalLessons - completedLessons} remaining`}
          color="green"
        />
        <StatCard
          icon={Flame}
          title="Current Streak"
          value={`${user?.current_streak || 0} days`}
          subtitle={`Best: ${user?.longest_streak || 0} days`}
          color="orange"
        />
        <StatCard
          icon={Star}
          title="Case Coins"
          value={user?.caseCoins || 0}
          subtitle="Spend in store"
          color="purple"
        />
      </div>

      {/* Progress Bars */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
        <ProgressBar
          label="Course Completion"
          current={completedLessons}
          total={totalLessons}
          color="blue"
        />
        <ProgressBar
          label="Current Level Progress"
          current={currentLevelXP}
          total={100}
          color="green"
        />
        <ProgressBar
          label="Weekly Goal"
          current={Math.min(completedLessons % 7, 5)}
          total={5}
          color="purple"
        />
      </div>

      {/* Skills and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillRadar skills={skills} />
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
};

export default Progress;
