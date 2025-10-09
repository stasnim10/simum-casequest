import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Flame, Clock, CheckCircle } from 'lucide-react';

const StreakProtection = ({ userStats, onUseFreeze, onBuyFreeze }) => {
  const [showModal, setShowModal] = useState(false);
  
  const hasActiveFreeze = userStats.streakFreezes > 0;
  const canUseGrace = userStats.lastActivity && 
    (Date.now() - userStats.lastActivity) < 48 * 60 * 60 * 1000; // 48 hours

  return (
    <>
      {/* Streak Protection Status */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Shield className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Streak Protection</h3>
              <p className="text-sm text-gray-600">
                {hasActiveFreeze ? `${userStats.streakFreezes} freeze(s) ready` : 'No protection active'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Manage
          </button>
        </div>
      </div>

      {/* Protection Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Flame className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Protect Your Streak</h2>
              <p className="text-gray-600">Keep your {userStats.streak}-day streak safe</p>
            </div>

            <div className="space-y-3 mb-6">
              {/* Streak Freeze */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Streak Freeze</p>
                    <p className="text-sm text-gray-600">Skip a day without losing streak</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{userStats.streakFreezes}</p>
                  <button
                    onClick={onBuyFreeze}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Buy more
                  </button>
                </div>
              </div>

              {/* Grace Period */}
              {canUseGrace && (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Grace Period</p>
                      <p className="text-sm text-gray-600">48h window available</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {hasActiveFreeze && (
                <button
                  onClick={() => {
                    onUseFreeze();
                    setShowModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Use Freeze
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default StreakProtection;
