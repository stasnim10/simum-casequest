import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Workflow } from 'lucide-react';

export default function BottomNav() {
  const links = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/learn', icon: BookOpen, label: 'Lessons' },
    { to: '/simulator', icon: Workflow, label: 'Simulator' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const IconComponent = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full ${
                  isActive ? 'text-indigo-600' : 'text-gray-500'
                }`
              }
            >
              <IconComponent className="w-6 h-6" />
              <span className="mt-1 text-xs">{link.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
