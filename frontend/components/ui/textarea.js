import React from 'react';

export function Textarea({ value, onChange, placeholder, className }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-2 border border-gray-300 rounded-md resize-y ${className}`}
    />
  );
}
