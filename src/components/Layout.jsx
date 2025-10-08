import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Bot, BarChart3, Home, Trophy, Flame, Star } from 'lucide-react';
import useStore from '../state/store';

export default function Layout({ children }) {
  const location = useLocation();
  const { user } = useStore();

  const navItems = [
    { icon: BookOpen, label: 'Learn', path: '/learn' },
    { icon: Bot, label: 'Case', path: '/case' },
    { icon: BarChart3, label: 'Review', path: '/review' },
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Trophy, label: 'Rank', path: '/leaderboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="text-xl font-bold text-gray-900">
            CaseQuest
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{user.streak}</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{user.xp}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive(item.path) ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
