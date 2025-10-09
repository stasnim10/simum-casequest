
import React, { useState } from 'react';
import { chat } from './firebase'; // Import the chat function

const AICaseSimulator = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      const messageToSend = input;
      setInput('');
      setLoading(true);

      try {
        const result = await chat({ message: messageToSend });
        const aiMessage = { text: result.data.response, sender: 'ai' };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error("Error calling chat function:", error);
        const errorMessage = { text: 'Sorry, something went wrong. Please try again.', sender: 'ai' };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full" style={{height: 'calc(100vh - 200px)'}}>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`rounded-lg px-4 py-2 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-2">
            <div className="rounded-lg px-4 py-2 bg-gray-200 text-gray-800">
              ...
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            className="flex-1 border rounded-l-lg p-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
            placeholder="Type your response..."
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading} className="bg-blue-500 text-white rounded-r-lg px-4 disabled:bg-blue-300">
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICaseSimulator;
