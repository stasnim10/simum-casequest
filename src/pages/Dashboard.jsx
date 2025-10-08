import { Link } from 'react-router-dom';
import { BookOpen, Bot, TrendingUp } from 'lucide-react';
import useStore from '../state/store';

export default function Dashboard() {
  const { user } = useStore();

  const quickActions = [
    { icon: BookOpen, title: 'Continue Learning', to: '/learn', color: 'blue' },
    { icon: Bot, title: 'Practice Case', to: '/case', color: 'purple' },
    { icon: TrendingUp, title: 'Review Progress', to: '/review', color: 'green' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {user.name}! 👋
      </h1>
      <p className="text-gray-600 mb-8">Ready to level up your consulting skills?</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">XP</div>
          <div className="text-2xl font-bold text-gray-900">{user.xp}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">Streak</div>
          <div className="text-2xl font-bold text-gray-900">{user.streak} days</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">Coins</div>
          <div className="text-2xl font-bold text-gray-900">{user.coins}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">Level</div>
          <div className="text-2xl font-bold text-gray-900">{Math.floor(user.xp / 100) + 1}</div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow`}
          >
            <action.icon className={`w-8 h-8 text-${action.color}-600 mb-3`} />
            <h3 className="font-semibold text-gray-900">{action.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
