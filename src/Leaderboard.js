
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Trophy } from 'lucide-react';

const Leaderboard = ({ currentUser }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('total_xp', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);
        
        const leaderboardData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLeaders(leaderboardData);
      } catch (err) {
        setError('Failed to load leaderboard. Please try again later.');
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center mb-6">
        <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Top Consultants</h1>
      </div>

      {loading && <div>Loading leaderboard...</div>}
      {error && <div className="text-red-600 text-center py-4">{error}</div>}

      <ul className="space-y-3">
        {leaders.map((user, index) => (
          <li 
            key={user.id} 
            className={`flex items-center p-4 rounded-lg transition-colors ${currentUser?.uid === user.id ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-50'}`}>
            <span className="font-bold text-lg text-gray-600 w-8">{index + 1}</span>
            <div className="flex-grow font-semibold text-gray-800">
              {user.email ? user.email.split('@')[0] : 'Anonymous'}
            </div>
            <div className="font-bold text-blue-600 text-lg">
              {user.total_xp} XP
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
