import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-10 animate-fade-in-up">
      <h1 className="text-4xl font-extrabold pb-2">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B9D] via-[#FF8E53] to-[#6B7BFF]">
          🚀 Smart Prompt Builder
        </span>
      </h1>
      <p className="text-gray-500 mt-2 text-sm font-medium tracking-wide uppercase">
        Create <span className="text-[#FF6B9D]">Perfect</span> AI Prompts in Seconds
      </p>
    </div>
  );
};

export default Header;