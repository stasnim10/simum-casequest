import { Star, Flame } from 'lucide-react';
import useStore from '../state/store';

export default function HeaderKPIs() {
  const xp = useStore((state) => state.user.xp);
  const streak = useStore((state) => state.user.streak);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1 text-yellow-500">
        <Star className="w-5 h-5" fill="currentColor" />
        <span className="font-bold">{xp}</span>
      </div>
      <div className="flex items-center gap-1 text-orange-500">
        <Flame className="w-5 h-5" fill="currentColor" />
        <span className="font-bold">{streak}</span>
      </div>
    </div>
  );
}
