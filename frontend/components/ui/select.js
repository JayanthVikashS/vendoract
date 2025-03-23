import React from 'react';

export function Select({ children, onValueChange }) {
  return (
    <div className="relative w-full">
      {children(onValueChange)}
    </div>
  );
}

export function SelectTrigger({ children }) {
  return (
    <div className="w-full p-2 border border-gray-300 rounded-md bg-white cursor-pointer shadow-sm">
      {children}
    </div>
  );
}

export function SelectContent({ children }) {
  return (
    <div className="absolute w-full mt-1 border border-gray-200 bg-white rounded-md shadow-lg z-10">
      {children}
    </div>
  );
}

export function SelectItem({ value, children, onClick }) {
  return (
    <div
      className="p-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => onClick(value)}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }) {
  return <span className="text-gray-500">{placeholder}</span>;
}
