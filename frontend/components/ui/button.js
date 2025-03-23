import React from 'react';

export function Button({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
}
