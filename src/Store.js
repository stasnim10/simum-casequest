
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { CircleDollarSign, Snowflake, Shield, HelpCircle } from 'lucide-react';

const iconMap = {
  Snowflake: <Snowflake className="h-10 w-10 text-blue-400 mb-4" />,
  Default: <HelpCircle className="h-10 w-10 text-gray-400 mb-4" />,
};

const Store = ({ user, onPurchase }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsSnapshot = await getDocs(collection(db, 'store_items'));
        const itemsList = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(itemsList);
      } catch (err) {
        setError('Failed to load store items. Please try again later.');
        console.error("Error fetching store items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="p-4">
      {/* Demo Alert */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">Demo Mode</span>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          This is a preview of the shop feature. Purchases are simulated for demonstration purposes.
        </p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Store</h1>
        <div className="flex items-center text-lg font-semibold bg-yellow-100 text-yellow-800 rounded-full px-4 py-2">
          <CircleDollarSign className="h-6 w-6 mr-2" />
          <span>{user?.caseCoins ?? 0} Coins</span>
        </div>
      </div>

      {loading && <div>Loading items...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            {iconMap[item.icon] || iconMap.Default}
            <h2 className="text-xl font-bold mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
            <div className="flex items-center justify-center mb-4">
              <CircleDollarSign className="h-5 w-5 mr-1 text-yellow-600" />
              <span className="text-lg font-semibold">{item.cost}</span>
            </div>
            <button
              onClick={() => onPurchase(item)}
              disabled={user.caseCoins < item.cost}
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
