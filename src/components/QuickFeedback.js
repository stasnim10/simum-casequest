import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X, ThumbsUp, ThumbsDown } from 'lucide-react';

const QuickFeedback = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (type) => {
    // Track feedback (could integrate with analytics)
    console.log(`Feedback: ${type}`);
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
    }, 2000);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <MessageCircle className="w-5 h-5" />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-20 right-6 bg-white rounded-lg shadow-xl p-4 w-64 z-50"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Quick Feedback</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          {submitted ? (
            <p className="text-green-600 text-sm">Thanks for your feedback! 🙏</p>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-3">How's your experience?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFeedback('positive')}
                  className="flex-1 flex items-center justify-center gap-1 p-2 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Good</span>
                </button>
                <button
                  onClick={() => handleFeedback('negative')}
                  className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="text-sm">Issues</span>
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </>
  );
};

export default QuickFeedback;
