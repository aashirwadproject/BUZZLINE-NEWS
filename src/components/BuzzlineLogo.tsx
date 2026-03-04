import React from 'react';

export const BuzzlineLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 200 200" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Red Circle Background */}
    <circle cx="100" cy="100" r="95" fill="#C61B18" />
    {/* Black Outer Ring */}
    <circle cx="100" cy="100" r="96" fill="none" stroke="#1A1A1A" strokeWidth="3" />
    
    {/* Camera & Mic Icon Group */}
    <g transform="translate(70, 45) scale(0.6)">
      {/* Microphone */}
      <rect x="38" y="-10" width="24" height="40" rx="12" fill="white" />
      <rect x="34" y="5" width="32" height="4" fill="#C61B18" />
      <rect x="34" y="15" width="32" height="4" fill="#C61B18" />
      <rect x="34" y="25" width="32" height="4" fill="#C61B18" />
      
      {/* Camera Body */}
      <path d="M0 45 Q0 40 5 40 H95 Q100 40 100 45 V105 Q100 110 95 110 H5 Q0 110 0 105 Z" fill="white" />
      {/* Lens */}
      <circle cx="50" cy="75" r="24" fill="#C61B18" />
      <circle cx="50" cy="75" r="16" fill="white" />
      
      {/* Arrow pointing up-right */}
      <path 
        d="M85 40 L130 -5 M130 -5 H105 M130 -5 V20" 
        stroke="white" 
        strokeWidth="12" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </g>

    {/* Text: BUZZLINE */}
    <text 
      x="100" 
      y="135" 
      textAnchor="middle" 
      fill="white" 
      fontSize="38" 
      fontWeight="900" 
      fontFamily="Impact, sans-serif"
      style={{ letterSpacing: '-0.5px' }}
    >
      BUZZLINE
    </text>
    {/* Text: NEPAL */}
    <text 
      x="100" 
      y="172" 
      textAnchor="middle" 
      fill="white" 
      fontSize="38" 
      fontWeight="900" 
      fontFamily="Impact, sans-serif"
      style={{ letterSpacing: '-0.5px' }}
    >
      NEPAL
    </text>
  </svg>
);
