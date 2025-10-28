import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import HelpBeacon from './HelpBeacon';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <main className="pb-24">
        <Outlet />
      </main>
      <BottomNav />
      <HelpBeacon />
    </div>
  );
}
