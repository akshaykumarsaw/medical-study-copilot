import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-medical-brown/80 font-sans">
          {label}
        </label>
      )}
      <input
        className={`px-3 py-2 bg-parchment-light border border-medical-brown/10 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal transition-all ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
