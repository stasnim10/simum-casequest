import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import HeaderKPIs from './HeaderKPIs';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="flex justify-between items-center px-4 py-3">
          <h1 className="text-xl font-bold text-indigo-600">CaseQuest</h1>
          <HeaderKPIs />
        </div>
      </header>
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
