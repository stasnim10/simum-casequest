
import React from 'react';
import { Flame, CircleDollarSign } from 'lucide-react';

const GamificationHeader = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3 mb-6">
      <div className="flex items-center justify-end space-x-8">
        <div className="flex items-center text-yellow-600">
          <CircleDollarSign className="h-6 w-6 mr-2" />
          <span className="font-bold text-lg">{user.caseCoins != null ? user.caseCoins : 0}</span>
        </div>
        <div className="flex items-center text-orange-600">
          <Flame className="h-6 w-6 mr-2" />
          <span className="font-bold text-lg">{user.current_streak != null ? user.current_streak : 0}</span>
        </div>
      </div>
    </div>
  );
};

export default GamificationHeader;
