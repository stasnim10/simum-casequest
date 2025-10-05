import React, { useState } from 'react';

const TestComponent = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Test Component</h2>
      <p>Count: {count}</p>
      <button 
        onClick={handleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Increment
      </button>
    </div>
  );
};

export default TestComponent;
