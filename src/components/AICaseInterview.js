import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Send, Volume2, VolumeX, 
  Bot, User, TrendingUp, Target, Brain, ArrowLeft
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import SmartCaseAI from '../services/smartCaseAI';

const AICaseInterview = ({ caseType = 'profitability', onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiEngine] = useState(new SmartCaseAI());
  const [currentScore, setCurrentScore] = useState({ structure: 0, math: 0, insight: 0 });
  const [showScore, setShowScore] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    aiEngine.reset(caseType);
    const initMessage = {
      role: 'assistant',
      content: `Hi! I'm your Smart AI interviewer. Today we'll work on a ${caseType.replace('-', ' ')} case. I'll analyze your responses and provide real-time feedback. Ready to begin?`,
      timestamp: Date.now()
    };
    setMessages([initMessage]);
  }, [caseType, aiEngine]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content) => {
    if (!content.trim()) return;

    const userMessage = { 
      role: 'user', 
      content, 
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      try {
        const aiResponse = aiEngine.getResponse(content, caseType);
        
        const assistantMessage = { 
          role: 'assistant', 
          content: aiResponse.message,
          feedback: aiResponse.feedback,
          hint: aiResponse.hint,
          timestamp: Date.now()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentScore(aiResponse.score);
      } catch (error) {
        console.error('Error getting AI response:', error);
      } finally {
        setIsLoading(false);
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Smart AI Interviewer</h1>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500 capitalize">{caseType.replace('-', ' ')}</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-400">Smart AI Active</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowScore(!showScore)}
            className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
            title="Toggle Score"
          >
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Real-time Score Display */}
      {showScore && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 border-b"
        >
          <div className="flex justify-between items-center max-w-md">
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Structure</span>
              </div>
              <div className="text-lg font-bold text-purple-600">{currentScore.structure}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Math</span>
              </div>
              <div className="text-lg font-bold text-blue-600">{currentScore.math}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Insight</span>
              </div>
              <div className="text-lg font-bold text-green-600">{currentScore.insight}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                  {message.role === 'user' ? 
                    <User className="text-white w-4 h-4" /> : 
                    <Bot className="text-white w-4 h-4" />
                  }
                </div>
                <div className={`px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 shadow-sm'}`}>
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Show feedback and hints for AI messages */}
                  {message.role === 'assistant' && (message.feedback || message.hint) && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      {message.feedback && (
                        <div className="flex items-center gap-1 mb-1">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-700 font-medium">{message.feedback}</span>
                        </div>
                      )}
                      {message.hint && (
                        <div className="flex items-center gap-1">
                          <Brain className="w-3 h-3 text-purple-600" />
                          <span className="text-xs text-purple-700">{message.hint}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* AI Thinking Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <Bot className="text-white w-4 h-4" />
              </div>
              <div className="px-4 py-2 rounded-lg bg-white text-gray-900 shadow-sm">
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" text="" />
                  <span className="text-sm text-gray-600">
                    AI is analyzing your response...
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your response..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICaseInterview;
