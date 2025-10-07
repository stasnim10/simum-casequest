import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Send, Volume2, VolumeX, 
  MessageCircle, Bot, User, Play, Pause, AlertCircle 
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import voiceService from '../services/voiceService';

const AICaseInterview = ({ caseType = 'market-sizing', onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Enhanced AI introduction with context
    const initMessage = {
      role: 'assistant',
      content: isOnline 
        ? `Hi! I'm your AI case interviewer. Today we'll work on a ${caseType.replace('-', ' ')} case. I'll provide dynamic feedback and ask follow-up questions based on your responses. Are you ready to begin?`
        : `Hi! I'm in demo mode (offline). I'll provide scripted responses for this ${caseType.replace('-', ' ')} case. For full AI interaction, please connect to the internet.`,
      timestamp: Date.now()
    };
    setMessages([initMessage]);
  }, [caseType, isOnline]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAIResponse = async (conversation, caseType) => {
    if (!isOnline) {
      // Fallback scripted responses
      const scriptedResponses = [
        "That's an interesting approach. Can you walk me through your reasoning?",
        "Good thinking. What factors would you consider next?",
        "How would you structure this problem?",
        "What assumptions are you making here?",
        "Can you quantify that estimate?"
      ];
      return scriptedResponses[Math.floor(Math.random() * scriptedResponses.length)];
    }

    try {
      // Real AI integration (replace with your preferred AI service)
      const response = await fetch('/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversation,
          caseType,
          context: 'consulting_case_interview'
        })
      });

      if (!response.ok) throw new Error('AI service unavailable');
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.warn('AI service failed, using fallback:', error);
      return "I'm having trouble connecting to my AI brain right now. Can you rephrase your response? Meanwhile, think about how you'd structure this problem step by step.";
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = { 
      role: 'user', 
      content, 
      timestamp: Date.now() 
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(updatedMessages, caseType);
      const assistantMessage = { 
        role: 'assistant', 
        content: aiResponse,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (voiceEnabled && voiceService && voiceService.speak) {
        setIsSpeaking(true);
        voiceService.speak(aiResponse, () => setIsSpeaking(false));
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceInput = () => {
    setIsListening(true);
    if (voiceService && voiceService.startListening) {
      voiceService.startListening(
        (transcript) => {
          setIsListening(false);
          handleSendMessage(transcript);
        },
        (error) => {
          setIsListening(false);
          console.error('Voice recognition error:', error);
        }
      );
    } else {
      // Fallback if voice service not available
      setIsListening(false);
      alert('Voice input not available in this browser');
    }
  };

  const stopVoiceInput = () => {
    setIsListening(false);
    if (voiceService && voiceService.stopListening) {
      voiceService.stopListening();
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking && voiceService && voiceService.stopSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">AI Case Interview</h1>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500 capitalize">{caseType.replace('-', ' ')}</p>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                <span className="text-xs text-gray-400">
                  {isOnline ? 'AI Active' : 'Demo Mode'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-full ${voiceEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          {onComplete && (
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              End Session
            </button>
          )}
        </div>
      </div>

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
                    {isOnline ? 'AI is thinking...' : 'Processing...'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <Bot className="text-white w-4 h-4" />
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="Type your response or use voice..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isListening || isLoading}
            />
          </div>
          
          <button
            onClick={isListening ? stopVoiceInput : startVoiceInput}
            disabled={isLoading}
            className={`p-2 rounded-full ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {isSpeaking && (
          <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
            <Volume2 className="w-4 h-4 mr-1 animate-pulse" />
            AI is speaking...
          </div>
        )}
      </div>
    </div>
  );
};

export default AICaseInterview;
