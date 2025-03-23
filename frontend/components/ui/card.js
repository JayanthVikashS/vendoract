import React from 'react';

export function Card({ children }) {
  return (
    <div className="bg-white shadow-md rounded-2xl border border-gray-200">
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}
