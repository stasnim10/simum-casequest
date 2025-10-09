import { Star, Flame } from 'lucide-react';
import useStore from '../state/store';

export default function HeaderKPIs() {
  const { user } = useStore();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1 text-yellow-500">
        <Star className="w-5 h-5" fill="currentColor" />
        <span className="font-bold">{user.xp}</span>
      </div>
      <div className="flex items-center gap-1 text-orange-500">
        <Flame className="w-5 h-5" fill="currentColor" />
        <span className="font-bold">{user.streak}</span>
      </div>
    </div>
  );
}
