import { NavLink } from 'react-router-dom';
import { Home, BookOpen, BarChart3 } from 'lucide-react';

export default function BottomNav() {
  const links = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/learn', icon: BookOpen, label: 'Learn' },
    { to: '/progress', icon: BarChart3, label: 'Progress' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full ${
                isActive ? 'text-indigo-600' : 'text-gray-500'
              }`
            }
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
