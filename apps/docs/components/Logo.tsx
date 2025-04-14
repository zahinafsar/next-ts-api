import React from 'react';

const Logo = () => {
  const gradientStyle = {
    fontFamily: 'sans-serif',
    background: '#0070f3',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 800
  };

  return (
    <div className="flex items-center">
      <span style={{ fontSize: '1.3rem', letterSpacing: '0.02em' }}>
        <span style={gradientStyle}>N</span>
        ext-
        <span style={gradientStyle}>T</span>
        S-
        <span style={gradientStyle}>A</span>
        PI
      </span>
    </div>
  );
};

export default Logo; 